import os
import pickle
import numpy as np
import faiss
from typing import List, Dict, Any, Optional
from app.config.settings import settings

class FAISSVectorStore:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self, dimension: int = 384):
        self.dimension = dimension
        self.index_dir = settings.VECTOR_DB_PATH
        self.index_path = os.path.join(self.index_dir, "index.faiss")
        self.metadata_path = os.path.join(self.index_dir, "metadata.pkl")
        
        self.index: Optional[faiss.IndexFlatIP] = None
        self.metadata: List[Dict[str, Any]] = []
        
        self.load()

    def load(self):
        """Loads FAISS index and metadata from disk if available."""
        if os.path.exists(self.index_path) and os.path.exists(self.metadata_path):
            try:
                self.index = faiss.read_index(self.index_path)
                with open(self.metadata_path, "rb") as f:
                    self.metadata = pickle.load(f)
                print(f"[FAISS] Loaded index with {self.index.ntotal} vectors and {len(self.metadata)} chunks.")
            except Exception as e:
                print(f"[FAISS] Error loading existing index: {e}. Creating a fresh index.")
                self._create_empty_index()
        else:
            self._create_empty_index()

    def _create_empty_index(self):
        # IndexFlatIP with normalized vectors computes Cosine Similarity
        self.index = faiss.IndexFlatIP(self.dimension)
        self.metadata = []

    def save(self):
        """Persists FAISS index and metadata to disk."""
        os.makedirs(self.index_dir, exist_ok=True)
        if self.index is not None:
            faiss.write_index(self.index, self.index_path)
            with open(self.metadata_path, "wb") as f:
                pickle.dump(self.metadata, f)
            print(f"[FAISS] Saved index ({self.index.ntotal} vectors) to {self.index_path}")

    def add_vectors(self, vectors: np.ndarray, chunks_metadata: List[Dict[str, Any]]):
        """
        Adds vectors and corresponding metadata to the index.
        vectors shape: (N, dimension)
        """
        if len(chunks_metadata) == 0:
            return

        if self.index is None:
            self.dimension = vectors.shape[1]
            self._create_empty_index()

        self.index.add(vectors)
        self.metadata.extend(chunks_metadata)
        self.save()

    def search(
        self,
        query_vector: np.ndarray,
        top_k: int = 5,
        subject_id: Optional[str] = None,
        document_id: Optional[str] = None,
        min_score: float = 0.20
    ) -> List[Dict[str, Any]]:
        """
        Performs similarity search with metadata filtering.
        """
        if self.index is None or self.index.ntotal == 0 or len(self.metadata) == 0:
            return []

        # Fetch more candidates to allow filtering by subject/doc
        fetch_k = min(self.index.ntotal, max(top_k * 4, 20))
        scores, indices = self.index.search(query_vector, fetch_k)

        results = []
        seen_texts = set()

        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(self.metadata):
                continue
            if score < min_score:
                continue

            item = self.metadata[idx]
            
            # Apply subject filter
            if subject_id and str(item.get("subject_id")) != str(subject_id):
                continue
                
            # Apply document filter
            if document_id and str(item.get("document_id")) != str(document_id):
                continue

            text_snippet = item.get("text", "")[:100]
            if text_snippet in seen_texts:
                continue
            seen_texts.add(text_snippet)

            results.append({
                "chunk_id": item.get("chunk_id"),
                "document_id": item.get("document_id"),
                "subject_id": item.get("subject_id"),
                "subject_name": item.get("subject_name"),
                "filename": item.get("filename"),
                "page_number": item.get("page_number", 1),
                "text": item.get("text"),
                "score": float(score)
            })

            if len(results) >= top_k:
                break

        return results

    def delete_document(self, document_id: str):
        """
        Removes chunks belonging to a document and rebuilds the index.
        """
        remaining_meta = []
        for item in self.metadata:
            if str(item.get("document_id")) != str(document_id):
                remaining_meta.append(item)

        if len(remaining_meta) == len(self.metadata):
            return # nothing removed

        from app.services.embedding_service import EmbeddingService
        emb_service = EmbeddingService.get_instance()

        if len(remaining_meta) == 0:
            self._create_empty_index()
            self.save()
            return

        texts = [m["text"] for m in remaining_meta]
        new_vectors = emb_service.encode(texts)

        self._create_empty_index()
        self.add_vectors(new_vectors, remaining_meta)
