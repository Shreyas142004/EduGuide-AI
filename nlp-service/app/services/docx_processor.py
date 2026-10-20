from docx import Document as DocxDoc
from typing import List, Dict, Any
from app.utils.text_utils import clean_text

class DocxProcessor:
    @staticmethod
    def extract_text(file_path: str) -> List[Dict[str, Any]]:
        """
        Extracts text from DOCX file.
        Groups content into logical pages (~400 words per page) for citation tracking.
        """
        doc = DocxDoc(file_path)
        all_paragraphs = []
        for p in doc.paragraphs:
            text = p.text.strip()
            if text:
                all_paragraphs.append(text)
                
        # Also extract table text
        for table in doc.tables:
            for row in table.rows:
                row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                if row_text:
                    all_paragraphs.append(row_text)

        if not all_paragraphs:
            return [{"page_number": 1, "text": "Document is empty."}]

        pages = []
        current_page_words = []
        page_num = 1
        
        for para in all_paragraphs:
            words = para.split()
            current_page_words.extend(words)
            if len(current_page_words) >= 400:
                pages.append({
                    "page_number": page_num,
                    "text": clean_text(" ".join(current_page_words))
                })
                page_num += 1
                current_page_words = []

        if current_page_words:
            pages.append({
                "page_number": page_num,
                "text": clean_text(" ".join(current_page_words))
            })

        return pages
