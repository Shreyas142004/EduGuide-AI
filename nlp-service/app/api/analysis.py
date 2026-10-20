from fastapi import APIRouter
from app.models.analysis_models import ExtractTopicsRequest, ExtractTopicsResponse
from app.services.text_processor import TextProcessor
from app.services.retrieval_service import RetrievalService

router = APIRouter()

@router.post("/extract-topics", response_model=ExtractTopicsResponse)
def extract_topics(request: ExtractTopicsRequest):
    retrieval_service = RetrievalService()
    # Search for all chunks associated with this document or subject
    chunks = retrieval_service.retrieve(
        query="important concepts overview introduction chapter topics",
        subject_id=request.subject_id,
        document_id=request.document_id,
        top_k=8,
        min_score=0.05
    )

    combined_text = " ".join([c["text"] for c in chunks])
    topics = TextProcessor.extract_topics(combined_text)

    return ExtractTopicsResponse(topics=topics)
