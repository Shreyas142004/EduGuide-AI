# EduGuide AI – Academic Mini-Project Report

## Project Title
**EduGuide AI: Personalized Student Academic Support System**

## 1. Abstract
Students often struggle with identifying specific weak conceptual areas across diverse coursework and lack structured guidance to prioritize study time before examinations. Traditional generic chatbot assistants hallucinate or provide overly broad answers not tailored to an individual student's syllabus. EduGuide AI addresses this challenge by fusing multi-factor academic weakness analysis, personalized study planning, and localized Retrieval-Augmented Generation (RAG). By embedding uploaded lecture notes (PDF, DOCX, TXT) into a high-performance FAISS vector index, the system grounds study recommendations, question-answering, and diagnostic quizzes directly in student-provided academic materials.

## 2. Problem Statement & Motivation
Existing educational platforms suffer from three distinct drawbacks:
1. **Generic AI responses**: Standard conversational models generate general web knowledge rather than referencing the specific textbook, slides, or curriculum of the student.
2. **Absence of personalized time allocation**: Students are left to guess how to divide limited revision hours across difficult versus mastered subjects.
3. **Disconnected assessment & remediation**: Quizzes rarely feed directly back into a dynamic study plan or alter subject weakness priorities.

EduGuide AI closes this loop: Diagnostic quiz outcomes actively adjust topic and subject performance ratings, which immediately reformulate the daily study plan.

## 3. Technology Stack & Microservice Architecture
- **Web Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Recharts, React Router. Full Dark and Light theme adaptation with zero color inversion artifacts.
- **Application Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT authentication, bcrypt password hashing, Multer file handling.
- **NLP Microservice**: Python 3.12, FastAPI, PyMuPDF (fitz), python-docx, SentenceTransformers (`all-MiniLM-L6-v2`), FAISS-CPU vector indexing, Scikit-Learn TF-IDF, Pydantic data schemas.
- **Storage**: Local uploads directory and disk-persisted FAISS vector index with metadata mappings.

## 4. Key Modules & Methodologies

### 4.1 Academic Weakness Analysis
Unlike arbitrary predictors, the system uses an objective multi-factor scoring methodology:
- Weighting: Current exam score (1.0x), Quiz performance (0.35x), Assignment score (0.15x), and Historical baseline (0.20x).
- Tiers: Excellent (90–100%), Strong (75–89%), Moderate (60–74%), Weak (<60%).
- High-priority subjects receive targeted focus alerts and the largest proportion of revision time.

### 4.2 Document Parsing, Chunking & FAISS Vector Indexing
- Uploaded PDFs, DOCX, and TXTs are extracted page-by-page.
- A sliding-window text chunker (250 words with 50-word overlap) partitions text without losing cross-sentence contextual boundaries.
- SentenceTransformers model `all-MiniLM-L6-v2` produces 384-dimensional dense vectors.
- FAISS IndexFlatIP executes inner product cosine similarity on unit-normalized vectors with sub-millisecond retrieval latency.

### 4.3 Grounded RAG Assistant
- Chat queries are matched against relevant chunk vectors filtered by subject or document ID.
- Responses cite specific source documents and page numbers.
- If relevant content is absent, the system prevents hallucinations with a clear boundary disclosure.

### 4.4 Dynamic Study Plan Allocation
Available daily study time (e.g. 180 minutes) is distributed according to priority:
- High Priority (Weak): ~50%
- Medium Priority (Moderate): ~30%
- Low Priority (Strong): ~20%
The plan dynamically redistributes time if any tier has zero subjects.

### 4.5 Exam Paper & Diagnostic Quiz Generation
Generates 2-mark definitions, 5-mark conceptual workflows, 10-mark architectural essays, MCQs, True/False, and fill-in-the-blanks directly from the indexed document passages.

## 5. Experimental Test Results
The test case verified with MCA semester 3 student profile (Shreyas):
- AI/ML (48%) -> Correctly classified as **HIGH PRIORITY**.
- DBMS (71%) & Web Tech (64%) -> Classified as **MEDIUM PRIORITY**.
- Java (82%) & Software Eng (78%) -> Classified as **LOW PRIORITY**.
- Topical evaluation identified Neural Networks (42%) and CNN (48%) as key focal points.
- Daily 3-hour budget was distributed as: AI/ML (90 min), DBMS (45 min), Web Tech (30 min), Java (15 min).
- Quiz on CNN (4/10) maintained weak status; subsequent re-test (8/10) elevated topic accuracy, automatically triggering study plan adjustments.

## 6. Conclusion
EduGuide AI successfully demonstrates that combining student academic metrics with local semantic RAG vector retrieval yields a practical, trustworthy, and actionable personal tutor.
