from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.api import documents, embeddings, chat, analysis, quiz

app = FastAPI(
    title="EduGuide AI - NLP & RAG Microservice",
    description="Dedicated microservice for document parsing, semantic vector indexing, RAG synthesis, and Gemini AI academic support.",
    version="1.0.0"
)

# Enable CORS for internal backend and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    from app.services.embedding_service import EmbeddingService
    from app.services.vector_store import FAISSVectorStore
    print("[NLP] Pre-warming embedding model and vector store...")
    EmbeddingService.get_instance()
    FAISSVectorStore.get_instance()
    print("[NLP] NLP microservice startup ready.")

# Health endpoint
@app.get("/nlp/health")
def health_check():
    gemini_key = settings.GEMINI_API_KEY or settings.LLM_API_KEY
    return {
        "status": "healthy",
        "service": "EduGuide AI Python NLP Service",
        "gemini_model": settings.GEMINI_MODEL,
        "gemini_configured": bool(gemini_key),
        "embedding_model": settings.EMBEDDING_MODEL
    }

# Mount sub-routers under /nlp
app.include_router(documents.router, prefix="/nlp", tags=["Documents"])
app.include_router(embeddings.router, prefix="/nlp", tags=["Embeddings"])
app.include_router(chat.router, prefix="/nlp", tags=["Chat & RAG"])
app.include_router(analysis.router, prefix="/nlp", tags=["Topic Analysis"])
app.include_router(quiz.router, prefix="/nlp", tags=["Quiz"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
