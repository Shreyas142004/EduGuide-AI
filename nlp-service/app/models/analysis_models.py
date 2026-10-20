from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ChatMessageItem(BaseModel):
    role: str
    content: str

class StudentContext(BaseModel):
    student_name: Optional[str] = "Student"
    course: Optional[str] = None
    semester: Optional[int] = None
    daily_study_time: Optional[int] = None
    exam_date: Optional[str] = None
    high_priority_subjects: List[str] = Field(default_factory=list)
    weak_topics: List[str] = Field(default_factory=list)

class ChatRequest(BaseModel):
    message: str
    subject_id: Optional[str] = None
    subject_name: Optional[str] = None
    document_id: Optional[str] = None
    student_context: Optional[Dict[str, Any]] = Field(default_factory=dict)
    history: List[ChatMessageItem] = Field(default_factory=list)

class SourceReference(BaseModel):
    filename: str
    page_number: int
    excerpt: str
    subject: Optional[str] = ""
    score: Optional[float] = 0.0

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceReference] = Field(default_factory=list)
    suggested_questions: List[str] = Field(default_factory=list)

class QuestionItem(BaseModel):
    type: str # '2-mark', '5-mark', '10-mark', 'MCQ', 'True/False', 'Fill in the blanks'
    topic: str
    question: str
    model_answer: Optional[str] = ""
    options: Optional[List[str]] = None
    correct_answer: Optional[Any] = None

class ExamQuestionsRequest(BaseModel):
    subject_id: Optional[str] = None
    subject_name: Optional[str] = None
    document_id: Optional[str] = None
    topic: Optional[str] = "Core Topics"
    count: int = 5
    question_types: List[str] = Field(default_factory=lambda: ['2-mark', '5-mark', '10-mark'])

class ExamQuestionsResponse(BaseModel):
    subject_name: str
    topic: str
    questions: List[QuestionItem]
    sources: List[SourceReference] = Field(default_factory=list)

class QuizQuestionItem(BaseModel):
    question: str
    options: List[str]
    correctAnswer: int # index 0-3
    explanation: str
    topic: str

class QuizRequest(BaseModel):
    subject_id: Optional[str] = None
    subject_name: Optional[str] = None
    document_id: Optional[str] = None
    topic: Optional[str] = "General"
    count: int = 5

class QuizResponse(BaseModel):
    subject_name: str
    topic: str
    questions: List[QuizQuestionItem]

class ExtractTopicsRequest(BaseModel):
    document_id: Optional[str] = None
    file_path: Optional[str] = None
    subject_id: Optional[str] = None

class ExtractTopicsResponse(BaseModel):
    topics: List[str]
