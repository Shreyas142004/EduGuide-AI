from fastapi import APIRouter
from app.models.analysis_models import QuizRequest, QuizResponse, QuizQuestionItem
from app.services.retrieval_service import RetrievalService
from app.services.llm_service import LLMService

router = APIRouter()

@router.post("/generate-quiz", response_model=QuizResponse)
def generate_quiz(request: QuizRequest):
    retrieval_service = RetrievalService()
    llm_service = LLMService.get_instance()

    # Search document chunks related to the topic/subject
    query = f"{request.topic or ''} {request.subject_name or ''} definitions mechanism concepts questions"
    chunks = retrieval_service.retrieve(
        query=query.strip(),
        subject_id=request.subject_id,
        document_id=request.document_id,
        top_k=6,
        min_score=0.10
    )

    questions_data = llm_service.generate_quiz(
        subject=request.subject_name or "Subject",
        topic=request.topic or "Core Concepts",
        context_chunks=chunks,
        num_questions=request.count or 5,
        difficulty=getattr(request, "difficulty", "Medium")
    )

    validated_questions = [
        QuizQuestionItem(
            question=q["question"],
            options=q["options"],
            correctAnswer=q["correctAnswer"],
            explanation=q["explanation"],
            topic=q.get("topic", request.topic or "General")
        )
        for q in questions_data
    ]

    return QuizResponse(
        subject_name=request.subject_name or "General",
        topic=request.topic or "General",
        questions=validated_questions
    )
