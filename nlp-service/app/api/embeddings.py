from fastapi import APIRouter
from typing import List, Dict, Any
from pydantic import BaseModel
from app.services.embedding_service import EmbeddingService
from app.services.vector_store import FAISSVectorStore
from app.models.document_models import SearchRequest, SearchResponse, SearchResultItem

router = APIRouter()

class EmbedRequest(BaseModel):
    texts: List[str]

class EmbedResponse(BaseModel):
    dimension: int
    count: int

@router.post("/embed", response_model=EmbedResponse)
def generate_embeddings(request: EmbedRequest):
    service = EmbeddingService.get_instance()
    vectors = service.encode(request.texts)
    return EmbedResponse(dimension=service.dimension, count=len(vectors))

@router.post("/search", response_model=SearchResponse)
def search_vectors(request: SearchRequest):
    service = EmbeddingService.get_instance()
    vector_store = FAISSVectorStore.get_instance()

    query_vector = service.encode(request.query)
    results = vector_store.search(
        query_vector=query_vector,
        top_k=request.top_k,
        subject_id=request.subject_id,
        document_id=request.document_id
    )

    items = [SearchResultItem(**r) for r in results]
    return SearchResponse(query=request.query, results=items)
