import os
import threading
import numpy as np
from typing import List, Union
from app.config.settings import settings

class EmbeddingService:
    _instance = None
    _lock = threading.RLock()

    @classmethod
    def get_instance(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = cls()
            return cls._instance

    def __init__(self):
        self.model_name = settings.EMBEDDING_MODEL
        self._model = None
        self._fallback_vectorizer = None
        self._use_fallback = False
        self._load_model()

    def _load_model(self):
        with self._lock:
            if self._model is not None or self._use_fallback:
                return

            # Check if local SentenceTransformer model snapshot exists in disk cache
            model_slug = "models--" + self.model_name.replace("/", "--")
            cache_snapshots = os.path.expanduser(f"~/.cache/huggingface/hub/{model_slug}/snapshots")
            
            if os.path.exists(cache_snapshots) and os.environ.get("USE_FALLBACK_EMBEDDINGS", "0") != "1":
                try:
                    from sentence_transformers import SentenceTransformer
                    self._model = SentenceTransformer(self.model_name, local_files_only=True)
                    print(f"[NLP] Loaded cached SentenceTransformer: {self.model_name}")
                    return
                except Exception as e:
                    print(f"[NLP] Failed to load local SentenceTransformer: {e}")

            print("[NLP] Using high-speed normalized HashingVectorizer (dim=384) for embedding and semantic retrieval.")
            self._init_fallback()

    def _init_fallback(self):
        from sklearn.feature_extraction.text import HashingVectorizer
        self._fallback_vectorizer = HashingVectorizer(
            n_features=384,
            alternate_sign=False,
            norm='l2',
            ngram_range=(1, 2)
        )
        self._use_fallback = True
        self._model = None

    def encode(self, texts: Union[str, List[str]]) -> np.ndarray:
        """
        Generates normalized float32 embeddings for text or list of texts.
        Returns shape (N, 384).
        """
        if isinstance(texts, str):
            texts = [texts]

        if not texts:
            return np.empty((0, self.dimension), dtype='float32')

        if self._model is not None:
            try:
                embeddings = self._model.encode(
                    texts,
                    convert_to_numpy=True,
                    normalize_embeddings=True,
                    show_progress_bar=False
                )
                return embeddings.astype('float32')
            except Exception as e:
                print(f"[NLP] SentenceTransformer encode error: {e}. Falling back to HashingVectorizer.")
                self._init_fallback()

        if self._fallback_vectorizer is None:
            self._init_fallback()

        X = self._fallback_vectorizer.transform(texts).toarray().astype('float32')
        # Ensure L2 norm is exactly 1 for all rows (avoid divide by zero for blank texts)
        norms = np.linalg.norm(X, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        X = X / norms
        return X

    @property
    def dimension(self) -> int:
        return 384

