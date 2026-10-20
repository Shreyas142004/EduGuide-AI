from typing import List, Dict, Any
from app.utils.text_utils import clean_text

class TextProcessor:
    @staticmethod
    def extract_text(file_path: str) -> List[Dict[str, Any]]:
        """
        Extracts text from TXT files.
        Partitions into logical pages (~400 words per page).
        """
        encodings = ['utf-8', 'latin-1', 'cp1252']
        raw_text = ""
        for enc in encodings:
            try:
                with open(file_path, 'r', encoding=enc) as f:
                    raw_text = f.read()
                break
            except (UnicodeDecodeError, Exception):
                continue
                
        cleaned = clean_text(raw_text)
        if not cleaned:
            return [{"page_number": 1, "text": "Document is empty."}]

        words = cleaned.split()
        pages = []
        page_num = 1
        chunk_size = 400
        
        for i in range(0, len(words), chunk_size):
            page_slice = words[i:i + chunk_size]
            pages.append({
                "page_number": page_num,
                "text": " ".join(page_slice)
            })
            page_num += 1

        return pages

    @staticmethod
    def extract_topics(text: str, max_topics: int = 8) -> List[str]:
        """
        Extracts salient academic topics and concepts from document text.
        """
        import re
        if not text:
            return []

        # Find capitalized multi-word phrases and technical terms
        candidates = re.findall(r'\b[A-Z][a-zA-Z0-9_\-\+]{2,}(?:\s+[A-Z][a-zA-Z0-9_\-\+]{2,})*\b', text)
        filtered = []
        stop_phrases = {
            'Introduction', 'Chapter', 'Page', 'Figure', 'Table', 'Section',
            'Summary', 'Conclusion', 'Example', 'Overview', 'Unit', 'Topic',
            'Department', 'University', 'College', 'Author', 'Index', 'Notes'
        }

        freq = {}
        for c in candidates:
            c_clean = c.strip()
            if c_clean not in stop_phrases and len(c_clean) > 3 and not c_clean.isdigit():
                freq[c_clean] = freq.get(c_clean, 0) + 1

        # Sort by frequency descending
        sorted_topics = sorted(freq.keys(), key=lambda k: freq[k], reverse=True)
        return sorted_topics[:max_topics]
