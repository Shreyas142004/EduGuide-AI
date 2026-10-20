# EduGuide AI – Architecture & System Design

EduGuide AI is a distributed, full-stack academic support system designed to analyze student academic weaknesses, index course materials using local vector search (FAISS), and generate personalized study plans and exam questions.

## High-Level System Architecture

```
┌───────────────────────────────────────────┐
│            React.js + Vite UI             │
│   (Light & Dark Mode, Recharts, Tailwind)  │
└─────────────────────┬─────────────────────┘
                      │ REST API / JSON
                      ▼
┌───────────────────────────────────────────┐
│          Node.js + Express.js             │
│        (Main Application Backend)         │
│   - Authentication (JWT + bcrypt)         │
│   - Weakness Analysis Engine              │
│   - Dynamic Study Plan Generator          │
│   - Multer File Upload & Storage          │
└──────────────┬────────────────────┬───────┘
               │                    │ Axios HTTP (Internal)
               ▼                    ▼
┌──────────────────────┐    ┌───────────────────────────────────┐
│       MongoDB        │    │        Python NLP Service         │
│  (Mongoose Schemas)  │    │     (FastAPI + FAISS + PyTorch)   │
│  - Users             │    │  - PyMuPDF / python-docx / Text   │
│  - Subjects          │    │  - SentenceTransformers Embedding │
│  - Performances      │    │  - FAISS Vector Similarity Store  │
│  - Documents         │    │  - RAG Retrieval & Synthesis      │
│  - Chat Sessions     │    │  - Topic Extraction (TF-IDF/NLP)  │
│  - Study Plans       │    │  - Exam & Quiz Question Generator │
│  - Quizzes & Attempts│    │  - Provider-Agnostic LLM / Fallback│
└──────────────────────┘    └───────────────────────────────────┘
```

## Key Architectural Principles

1. **Separation of Concerns**:
   - The **Node.js/Express** backend acts as the authoritative application server for all user management, authentication, CRUD operations, database persistence, and weakness analysis.
   - The **Python FastAPI** microservice operates purely as an internal NLP engine, responsible for resource-intensive operations: document parsing, sliding-window chunking, SentenceTransformer vector embeddings, FAISS indexing, similarity retrieval, and question synthesis.

2. **Document Ingestion Pipeline (Multer -> FastAPI -> FAISS)**:
   ```
   React File Drop -> Express Multer Storage -> POST /nlp/process-document
   -> Text Cleaning & Normalization -> Overlapping Sentence Chunking
   -> all-MiniLM-L6-v2 Normalization -> faiss.IndexFlatIP Addition
   -> Vector Index Persistence -> MongoDB Document Metadata Update
   ```

3. **Grounding & RAG Retrieval**:
   - Student queries are embedded into the 384-dimensional latent space.
   - FAISS executes inner product search (cosine similarity on unit-normalized vectors).
   - Results are filtered by `subject_id` or `document_id` if selected by the student.
   - Excerpts are formatted with exact file names and page numbers for citation.
   - If no relevant text is found above threshold, the model declares: *"Sorry, I couldn't find enough information about this topic in your uploaded study material."*

4. **Multi-Factor Weakness & Study Priority Algorithm**:
   - Combines exam marks, previous exam trend, assignment scores, and topic-level quiz accuracy into an effective percentage.
   - Classes:
     - 90–100% -> Excellent (Low Priority)
     - 75–89% -> Strong (Low Priority)
     - 60–74% -> Moderate (Medium Priority)
     - <60% -> Weak (High Priority)
   - Dynamic study time allocation: ~50% to High Priority, ~30% to Medium Priority, and ~20% to Low Priority subjects.
