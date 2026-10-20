from fastapi import APIRouter, HTTPException
from app.models.document_models import ProcessDocumentRequest, ProcessDocumentResponse
from app.utils.file_utils import validate_and_resolve_file, get_file_extension
from app.services.pdf_processor import PDFProcessor
from app.services.docx_processor import DocxProcessor
from app.services.text_processor import TextProcessor
from app.services.text_chunker import TextChunker
from app.services.embedding_service import EmbeddingService
from app.services.vector_store import FAISSVectorStore

router = APIRouter()

@router.post("/process-document", response_model=ProcessDocumentResponse)
def process_document(request: ProcessDocumentRequest):
    valid, file_path_or_err = validate_and_resolve_file(request.file_path)
    if not valid:
        raise HTTPException(status_code=400, detail=file_path_or_err)

    ext = get_file_extension(file_path_or_err)
    pages = []

    try:
        if ext == 'pdf':
            pages = PDFProcessor.extract_text(file_path_or_err)
        elif ext == 'docx':
            pages = DocxProcessor.extract_text(file_path_or_err)
        elif ext == 'txt':
            pages = TextProcessor.extract_text(file_path_or_err)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported format: {ext}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

    if not pages:
        raise HTTPException(status_code=400, detail="Document contains no readable text")

    # Chunk the document
    chunker = TextChunker()
    chunks = chunker.chunk_document(
        pages=pages,
        document_id=request.document_id,
        subject_id=request.subject_id,
        subject_name=request.subject_name or "General",
        filename=request.filename
    )

    if not chunks:
        # Fallback single chunk
        chunks = [{
            "chunk_id": f"{request.document_id}-0",
            "document_id": request.document_id,
            "subject_id": request.subject_id,
            "subject_name": request.subject_name or "General",
            "filename": request.filename,
            "page_number": 1,
            "text": pages[0]["text"][:1000]
        }]

    # Generate Embeddings
    embedding_service = EmbeddingService.get_instance()
    texts = [c["text"] for c in chunks]
    vectors = embedding_service.encode(texts)

    # Store in FAISS
    vector_store = FAISSVectorStore.get_instance()
    vector_store.add_vectors(vectors, chunks)

    # Extract Topics
    combined_text = "\n".join(texts[:10])
    extracted_topics = TextProcessor.extract_topics(combined_text)

    return ProcessDocumentResponse(
        success=True,
        document_id=request.document_id,
        pages=len(pages),
        chunks=len(chunks),
        extracted_topics=extracted_topics,
        message=f"Indexed {len(chunks)} chunks across {len(pages)} pages"
    )
