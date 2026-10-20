import re
from typing import List

def clean_text(text: str) -> str:
    """Cleans raw extracted text while preserving academic symbols and structure."""
    if not text:
        return ""
    
    # Replace non-breaking spaces and special zero-width chars
    text = text.replace('\u00a0', ' ').replace('\u200b', '')
    
    # Normalize multiple whitespace within a line
    text = re.sub(r'[ \t]+', ' ', text)
    
    # Normalize 3+ line breaks into 2 line breaks
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Remove leading/trailing spaces per line
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)
    
    return text.strip()

def split_into_sentences(text: str) -> List[str]:
    """Splits text into sentences using regex boundary matching."""
    if not text:
        return []
    # Match sentence endings (. ! ?) followed by space and uppercase letter or EOF
    sentences = re.split(r'(?<=[.!?])\s+', text)
    return [s.strip() for s in sentences if s.strip()]

def truncate_text(text: str, max_chars: int = 200) -> str:
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rstrip() + "..."
