import os
from pathlib import Path
from typing import Tuple

def validate_and_resolve_file(file_path: str) -> Tuple[bool, str]:
    """Validates that the file exists and is within allowed bounds."""
    path = Path(file_path).resolve()
    if not path.exists():
        return False, f"File does not exist: {file_path}"
    if not path.is_file():
        return False, f"Path is not a regular file: {file_path}"
    
    ext = path.suffix.lower()
    if ext not in ['.pdf', '.docx', '.txt']:
        return False, f"Unsupported file extension: {ext}. Allowed: .pdf, .docx, .txt"
        
    return True, str(path)

def get_file_extension(file_path: str) -> str:
    return Path(file_path).suffix.lower().replace('.', '')
