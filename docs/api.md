# EduGuide AI – API Specification

## Main Backend API (Node.js / Express on `:5000`)

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new student profile |
| `POST` | `/api/auth/login` | Public | Authenticate student and issue JWT |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated student profile |
| `PUT` | `/api/auth/profile` | Private | Update student profile and daily study time |

### Subjects (`/api/subjects`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/subjects` | Private | List all subjects for student |
| `POST` | `/api/subjects` | Private | Create a new subject |
| `PUT` | `/api/subjects/:id` | Private | Update subject details |
| `DELETE` | `/api/subjects/:id` | Private | Delete subject and related documents/scores |

### Documents (`/api/documents`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/documents/upload` | Private | Upload PDF/DOCX/TXT file with Multer |
| `GET` | `/api/documents` | Private | List uploaded study documents (filterable) |
| `GET` | `/api/documents/:id` | Private | Get document processing status & details |
| `DELETE` | `/api/documents/:id` | Private | Delete document and remove vector embeddings |

### Academic Performance & Weakness Analysis (`/api/performance` & `/api/analysis`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/performance` | Private | Fetch student subject marks |
| `POST` | `/api/performance` | Private | Upsert subject score and recalculate priority |
| `POST` | `/api/performance/:subjectId/topics` | Private | Update topic-level diagnostic score |
| `GET` | `/api/analysis/overview` | Private | Full academic weakness analysis & score tiers |
| `GET` | `/api/analysis/weak-subjects` | Private | Filtered list of HIGH priority subjects |
| `GET` | `/api/analysis/topics` | Private | Granular topic evaluations & rankings |

### AI Academic Chatbot (`/api/chat`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/chat` | Private | Submit prompt for RAG retrieval and synthesis |
| `GET` | `/api/chat/sessions` | Private | List student chat sessions |
| `GET` | `/api/chat/sessions/:id` | Private | Fetch chat session history and sources |
| `DELETE` | `/api/chat/sessions/:id` | Private | Delete chat session |

### Dynamic Study Plan (`/api/study-plan`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/study-plan/generate` | Private | Recalculate daily study plan based on priority |
| `GET` | `/api/study-plan` | Private | Fetch today's study plan |
| `PUT` | `/api/study-plan/:id` | Private | Toggle session completion status |

### Exam Preparation & Practice (`/api/exam`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/exam/topics` | Private | Get important, weak, and extracted topics |
| `POST` | `/api/exam/questions` | Private | Generate 2-mark, 5-mark, 10-mark, MCQ papers |

### Diagnostic Quizzes (`/api/quiz`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/quiz/generate` | Private | Generate multiple-choice quiz |
| `POST` | `/api/quiz/:id/submit` | Private | Submit answers, grade, and update weakness |
| `GET` | `/api/quiz/history` | Private | Fetch past quiz attempts and accuracy |
| `GET` | `/api/quiz/:id` | Private | Retrieve quiz questions |

---

## Python NLP Microservice (`:8000`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/nlp/health` | Health check and embedding model status |
| `POST` | `/nlp/process-document` | Parses text, chunks, embeds, and updates FAISS index |
| `POST` | `/nlp/embed` | Generates 384-d normalized vector embeddings |
| `POST` | `/nlp/search` | FAISS vector search with subject/document filters |
| `POST` | `/nlp/chat` | RAG retrieval + LLM / local synthesis with citations |
| `POST` | `/nlp/extract-topics` | TF-IDF and NLP keyword extraction |
| `POST` | `/nlp/generate-questions`| Generates 2-mark, 5-mark, 10-mark exam questions |
| `POST` | `/nlp/generate-quiz` | Generates 4-option MCQ quiz questions |
