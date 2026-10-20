from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ProcessDocumentRequest(BaseModel):
    document_id: str
    file_path: str
    filename: str
    file_type: str
    subject_id: str
    subject_name: Optional[str] = "General"

class ProcessDocumentResponse(BaseModel):
    success: bool
    document_id: str
    pages: int
    chunks: int
    extracted_topics: List[str] = Field(default_factory=list)
    message: str = "Document processed successfully"

class ChunkMetadata(BaseModel):
    chunk_id: str
    document_id: str
    subject_id: str
    subject_name: str
    filename: str
    page_number: int
    text: str

class SearchRequest(BaseModel):
    query: str
    subject_id: Optional[str] = None
    document_id: Optional[str] = None
    top_k: int = 4

class SearchResultItem(BaseModel):
    chunk_id: str
    document_id: str
    subject_id: str
    subject_name: str
    filename: str
    page_number: int
    text: str
    score: float

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResultItem]
