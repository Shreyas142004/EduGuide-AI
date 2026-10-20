import uuid
from typing import List, Dict, Any
from app.utils.text_utils import split_into_sentences

class TextChunker:
    def __init__(self, chunk_size_words: int = 250, overlap_words: int = 50):
        self.chunk_size = chunk_size_words
        self.overlap = overlap_words

    def chunk_document(
        self,
        pages: List[Dict[str, Any]],
        document_id: str,
        subject_id: str,
        subject_name: str,
        filename: str
    ) -> List[Dict[str, Any]]:
        """
        Chunks page-segmented text into overlapping semantic passages.
        Preserves documentId, subjectId, subjectName, filename, pageNumber, chunkId.
        """
        chunks = []

        for page in pages:
            page_num = page.get("page_number", 1)
            page_text = page.get("text", "")
            
            sentences = split_into_sentences(page_text)
            if not sentences:
                continue

            current_chunk_sentences = []
            current_word_count = 0

            for sent in sentences:
                sent_words = len(sent.split())
                if current_word_count + sent_words > self.chunk_size and current_chunk_sentences:
                    chunk_str = " ".join(current_chunk_sentences).strip()
                    if chunk_str:
                        chunks.append({
                            "chunk_id": str(uuid.uuid4()),
                            "document_id": document_id,
                            "subject_id": subject_id,
                            "subject_name": subject_name,
                            "filename": filename,
                            "page_number": page_num,
                            "text": chunk_str
                        })
                    
                    # Compute overlap from previous sentences
                    overlap_sentences = []
                    overlap_count = 0
                    for prev_sent in reversed(current_chunk_sentences):
                        prev_len = len(prev_sent.split())
                        if overlap_count + prev_len <= self.overlap:
                            overlap_sentences.insert(0, prev_sent)
                            overlap_count += prev_len
                        else:
                            break
                            
                    current_chunk_sentences = overlap_sentences + [sent]
                    current_word_count = overlap_count + sent_words
                else:
                    current_chunk_sentences.append(sent)
                    current_word_count += sent_words

            if current_chunk_sentences:
                chunk_str = " ".join(current_chunk_sentences).strip()
                if chunk_str:
                    chunks.append({
                        "chunk_id": str(uuid.uuid4()),
                        "document_id": document_id,
                        "subject_id": subject_id,
                        "subject_name": subject_name,
                        "filename": filename,
                        "page_number": page_num,
                        "text": chunk_str
                    })

        return chunks
