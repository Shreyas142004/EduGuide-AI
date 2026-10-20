from fastapi import APIRouter
from app.models.analysis_models import ChatRequest, ChatResponse
from app.services.rag_service import RAGService

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def handle_chat(request: ChatRequest):
    rag_service = RAGService()
    history_dicts = [{"role": h.role, "content": h.content} for h in request.history]
    
    response = rag_service.process_query(
        query=request.message,
        subject_id=request.subject_id,
        subject_name=request.subject_name,
        document_id=request.document_id,
        student_context=request.student_context,
        history=history_dicts
    )
    return response
