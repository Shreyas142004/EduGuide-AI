import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # Gemini AI Configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.8-flash"
    
    # Fallback / compatibility LLM keys
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gemini-3.8-flash"
    
    # Embeddings & Vector DB
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    VECTOR_DB_PATH: str = str(BASE_DIR.parent / "storage" / "vector_indexes")
    UPLOAD_DIR: str = str(BASE_DIR.parent / "storage" / "uploads")
    
    # Chunking
    CHUNK_SIZE: int = 350
    CHUNK_OVERLAP: int = 60
    
    class Config:
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.VECTOR_DB_PATH, exist_ok=True)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
