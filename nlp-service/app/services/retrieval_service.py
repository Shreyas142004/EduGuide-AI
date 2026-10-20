from typing import List, Dict, Any, Optional
from app.services.embedding_service import EmbeddingService
from app.services.vector_store import FAISSVectorStore

class RetrievalService:
    def __init__(self):
        self.embedding_service = EmbeddingService.get_instance()
        self.vector_store = FAISSVectorStore.get_instance()

    def retrieve(
        self,
        query: str,
        subject_id: Optional[str] = None,
        document_id: Optional[str] = None,
        top_k: int = 4,
        min_score: float = 0.22
    ) -> List[Dict[str, Any]]:
        """
        Embeds the query and performs filtered retrieval on FAISS index.
        """
        if not query or not query.strip():
            return []

        query_vector = self.embedding_service.encode(query.strip())
        results = self.vector_store.search(
            query_vector=query_vector,
            top_k=top_k,
            subject_id=subject_id,
            document_id=document_id,
            min_score=min_score
        )
        return results
