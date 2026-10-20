import pymupdf as fitz
from typing import List, Dict, Any
from app.utils.text_utils import clean_text

class PDFProcessor:
    @staticmethod
    def extract_text(file_path: str) -> List[Dict[str, Any]]:
        """
        Extracts text from PDF page by page.
        Returns a list of dicts: [{"page_number": int, "text": str}]
        """
        pages = []
        doc = fitz.open(file_path)
        try:
            for page_index in range(len(doc)):
                page = doc[page_index]
                raw_text = page.get_text("text")
                cleaned = clean_text(raw_text)
                if cleaned:
                    pages.append({
                        "page_number": page_index + 1,
                        "text": cleaned
                    })
        finally:
            doc.close()
            
        # If no extractable text was found on any page (e.g. scanned), provide a fallback
        if not pages:
            pages.append({
                "page_number": 1,
                "text": "Document contained no extractable text."
            })
            
        return pages
