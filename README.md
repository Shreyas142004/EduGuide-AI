# EduGuide AI – Personalized Student Academic Support System

EduGuide AI is a focused, full-stack academic performance and study assistance platform built as an MCA NLP mini-project. It analyzes student marks across coursework, identifies weak subjects and topics, dynamically schedules daily revision time, and grounds question-answering and diagnostic quiz generation directly in student-uploaded study materials (PDF, DOCX, TXT) using Google Gemini API and a Python NLP/RAG microservice.

---

## 🌟 Key Capabilities

1. **Academic Weakness Analysis**:
   - Multi-factor evaluation combining current exam marks, previous exam baselines, assignment scores, and topic-level quiz accuracy.
   - Dynamic classification: **Excellent (90–100%)**, **Strong (75–89%)**, **Moderate (60–74%)**, and **Weak (<60%)**.
   - Clear diagnostic explanations and revision priorities (*High Priority* for weak subjects, *Medium* for average, *Low/Revision* for strong).

2. **Personalized Dynamic Study Planning**:
   - Takes available daily study hours (e.g. 3 hours = 180 min) and exam dates.
   - Allocates time dynamically: **50% to High Priority (Weak)**, **30% to Medium Priority (Moderate)**, and **20% to Low Priority (Strong)** subjects.
   - Recalculates dynamically whenever diagnostic test scores update.

3. **Grounded Document-Based RAG Assistant (Google Gemini API)**:
   - Student notes (PDF, DOCX, TXT) are parsed, chunked, and embedded into local vector storage.
   - Retrieves relevant excerpts and sends context + question to Google Gemini (`gemini-1.5-flash`).
   - Answers include verified source citations displaying filename and exact page numbers.
   - If information is not found in uploaded material, clearly reports that it was not found in the uploaded documents.

4. **Diagnostic Quizzes & Topic Detection**:
   - Subject- and topic-specific multiple choice evaluations with difficulty levels (**Easy**, **Medium**, **Hard**).
   - Generates structured diagnostic quizzes from uploaded document context via Gemini.
   - Submissions automatically update subject quiz scores and identify weak topics.

5. **Lavender & Violet Theme**:
   - Cohesive **Lavender/Violet Light Theme** (#FAF9FF background, #7C3AED primary violet, #A78BFA lavender).
   - Matching **Violet/Lavender Dark Theme** (#100B1F background, #1D1533 card, #8B5CF6 primary violet, #C4B5FD light lavender).
   - Persisted across reloads in `localStorage`.

---

## 🧭 The 7 Core Sections

The application features exactly 7 focused sections:

1. **Dashboard** (`/dashboard`): Overall academic percentage, highest priority weak subject alert, today's time allocation, performance trend charts, and recent activity.
2. **Documents** (`/documents`): Student-driven document management. Upload lecture notes, chapter summaries, or slides in PDF, DOCX, or TXT format.
3. **Performance** (`/performance`): Comprehensive subject performance records, weakness analysis, and granular topic-level diagnostics.
4. **AI Assistant** (`/ai-chat`): Interactive academic tutor with suggested prompts (*Explain this topic simply*, *Explain as a 10-mark answer*, *Give me an example*, etc.) and strict source citations.
5. **Study Plan** (`/study-plan`): Daily study schedule with time distribution and checklist tracking.
6. **Quiz** (`/quiz`): Diagnostic quiz creation with target subject, topic, difficulty selection, and attempt history.
7. **Settings** (`/settings`): Student profile, daily study time, target exam date, theme toggle, and secure logout.

---

## 🏗️ Architecture

```
React (Vite)
     ↓
Node.js + Express
     ↓
MongoDB

Node.js
     ↓
Python NLP Service (FastAPI)
     ↓
Document Processing (PDF / DOCX / TXT)
     ↓
Text Chunking & Cleaning
     ↓
Embeddings & Vector Store (FAISS)
     ↓
Semantic Retrieval & Context
     ↓
Google Gemini API (gemini-1.5-flash)
     ↓
AI Response & Source Citations
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Tailwind CSS, Lucide React, Recharts, Axios |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer, Axios, dotenv, CORS |
| **Python NLP** | Python 3.12, FastAPI, Uvicorn, PyMuPDF, python-docx, SentenceTransformers (`all-MiniLM-L6-v2`), FAISS, Scikit-learn, Pydantic |
| **Generative AI** | Google Gemini API (`google-generativeai`, model `gemini-1.5-flash`) |

---

## 📁 Clean Project Structure

```
EduGuide-AI/
├── README.md
├── .gitignore
├── scripts/
│   ├── setup.js                 # Environment validator and directory initializer
│   └── clearDatabase.js         # Wipes all collections clean for manual uploads
│
├── backend/
│   ├── server.js                # Express app entry (8 required routes only)
│   ├── .env                     # PORT, MONGO_URI, JWT_SECRET, NLP_SERVICE_URL
│   └── src/
│       ├── config/              # db.js, env.js
│       ├── models/              # User, Subject, Performance, Document, ChatSession,
│       │                        # ChatMessage, StudyPlan, Quiz, QuizAttempt
│       ├── controllers/         # auth, subject, document, performance, analysis, chat, studyPlan, quiz
│       ├── routes/              # auth, subject, document, performance, analysis, chat, studyPlan, quiz
│       ├── middleware/          # authMiddleware, uploadMiddleware, errorMiddleware
│       └── services/            # nlpService, weaknessService, studyPlanService, quizService
│
├── nlp-service/
│   ├── main.py                  # FastAPI entry & health endpoint
│   ├── requirements.txt         # google-generativeai, fastapi, uvicorn, etc.
│   ├── .env                     # GEMINI_API_KEY, GEMINI_MODEL, EMBEDDING_MODEL, VECTOR_DB_PATH
│   └── app/
│       ├── config/              # settings.py
│       ├── api/                 # documents, embeddings, chat, analysis, quiz
│       └── services/            # pdf_processor, docx_processor, text_processor,
│                                # text_chunker, embedding_service, retrieval_service,
│                                # vector_store, llm_service, rag_service
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js       # Lavender/Violet color tokens and gradients
│   └── src/
│       ├── App.jsx              # Routes for exactly the 7 core pages + auth
│       ├── main.jsx
│       ├── components/          # common, layout, dashboard, documents, performance, chatbot, studyplan, quiz
│       ├── pages/               # Login, Register, Dashboard, Documents, Performance, AIChat, StudyPlan, Quiz, Settings
│       ├── context/             # AuthContext, ThemeContext
│       ├── services/            # api, authService, documentService, performanceService, chatService, studyPlanService, quizService
│       └── styles/              # index.css (Lavender/Violet CSS variables)
│
└── storage/
    ├── uploads/                 # Student-uploaded documents
    └── vector_indexes/          # FAISS semantic vector index
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/eduguide_ai
JWT_SECRET=eduguide_super_secret_jwt_key_2026
NLP_SERVICE_URL=http://127.0.0.1:8000/nlp
UPLOAD_DIR=../storage/uploads
```

### Python NLP Service (`nlp-service/.env`):
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
EMBEDDING_MODEL=all-MiniLM-L6-v2
VECTOR_DB_PATH=../storage/vector_indexes
HOST=127.0.0.1
PORT=8000
```

### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+
- **Python**: 3.10+ (tested on Python 3.12)
- **MongoDB**: Community edition running locally on `localhost:27017`

### 2. Start the Python NLP Microservice
```powershell
cd nlp-service
.\venv\Scripts\activate
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Health check is accessible at: `http://127.0.0.1:8000/nlp/health`

### 3. Start the Express Backend
```powershell
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

### 4. Initialize Database
```powershell
node scripts/seedDatabase.js
```
Seeds student profile **Shreyas** (`shreyas@eduguide.ai` / `password123`) with MCA coursework scores, dynamic study plan, and an empty document repository ready for upload.

### 5. Start the React Frontend
```powershell
cd frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Login

| Field | Value |
|---|---|
| **Email** | `shreyas@eduguide.ai` |
| **Password** | `password123` |
| **Program** | MCA • Semester 3 |

---

## 📄 License
MIT License. Created for MCA NLP Mini-Project.
#   E d u G u i d e - A I  
 