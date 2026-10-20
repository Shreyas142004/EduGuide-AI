# 🎓 EduGuide AI — Intelligent Academic Assistant & Diagnostic Learning Platform

[![Node.js](https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248.svg)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/LLM-Google%20Gemini-4285F4.svg)](https://ai.google.dev/)
[![FAISS](https://img.shields.io/badge/Vector%20Store-FAISS%20CPU-blue.svg)](https://github.com/facebookresearch/faiss)

**EduGuide AI** is an end-to-end, full-stack academic copilot and personalized study advisory system. It bridges the gap between raw academic marks and targeted daily revision by combining:
1. **Multi-Factor Weakness Diagnostics**: Identifies academic vulnerabilities by cross-referencing exam marks, assignment scores, and topic-level quiz accuracy.
2. **Local Vector Search (FAISS + SentenceTransformers)**: Ingests and semantic-indexes syllabus PDFs, slides, and notes without third-party vector cloud lock-in.
3. **Strictly Grounded RAG Tutoring**: Powered by Google Gemini with verified document citations, strict context bounding, and mobile-responsive chat.
4. **Dynamic Study Planner**: Automatically schedules daily revision sessions weighted toward high-priority weaknesses and sends email digests via Gmail SMTP.
5. **Interactive Diagnostic Quizzes**: Synthesizes difficulty-tailored quizzes on demand, updating topic mastery in real time.

---

## 📑 Table of Contents

- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Repository Folder Structure](#-repository-folder-structure)
- [Prerequisites](#-prerequisites)
- [Configuration & Environment Variables](#-configuration--environment-variables)
- [Step-by-Step Installation & Setup](#-step-by-step-installation--setup)
- [How to Run the Project](#-how-to-run-the-project)
- [API Endpoints Overview](#-api-endpoints-overview)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🏛 System Architecture

The platform uses a microservice-style decoupled architecture:

```
┌─────────────────────────────────────────────────────────────┐
│               Frontend: React 19 + Vite + Tailwind          │
│        (Dark/Light Modes, Recharts Analytics, Mobile UI)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Backend: Node.js + Express (Port 5000)             │
│  - JWT Authentication & Bcrypt Password Hashing             │
│  - Academic Weakness Scoring & Dynamic Time Allocation      │
│  - Study Plan Generator & Gmail SMTP Notifications          │
│  - Multer File Upload Handler & Storage Management          │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │ Internal HTTP (Axios)
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Database: MongoDB       │ │ Python NLP Service (FastAPI│
│   (Mongoose ODM Schemas)     │ │        Port 8000)          │
│  - Users & Profiles          │ │ - PyMuPDF / python-docx    │
│  - Subjects & Documents      │ │ - all-MiniLM-L6-v2 Embed   │
│  - Performance & Marks       │ │ - FAISS Vector Similarity  │
│  - Study Plans & Sessions    │ │ - RAG Document Grounding   │
│  - Chat History & Quizzes    │ │ - Google Gemini Synthesis  │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## ✨ Key Features

### 1. 📊 Academic Weakness Diagnostic Engine
- Analyzes exams, assignments, and quiz attempts to compute an **Effective Mastery Percentage**.
- Automatically categorizes topics and subjects:
  - 🔴 **High Priority (< 60%)**: Needs immediate attention.
  - 🟡 **Medium Priority (60% – 74%)**: Moderate comprehension.
  - 🟢 **Low Priority (≥ 75%)**: Strong mastery.

### 2. 📚 Document Ingestion & FAISS Vector Storage
- Supports **PDF**, **DOCX**, and **TXT** lecture notes and textbooks.
- Overlapping sliding-window chunking (350 tokens, 60-token overlap).
- Local 384-dimensional vector embedding using `SentenceTransformers (all-MiniLM-L6-v2)`.
- Fast vector similarity search with `faiss.IndexFlatIP` (Cosine similarity).

### 3. 🤖 Grounded AI Academic Tutor (RAG + Gemini)
- Queries are answered strictly using retrieved excerpts from the student's own uploaded materials.
- Exact **Document Name** and **Page Number** citations are provided with every answer.
- Prevents AI hallucinations: If the syllabus material does not contain the answer, the assistant clearly informs the student.
- **Mobile Optimized**: Includes a slide-in drawer for chat history and knowledge scope filters on mobile viewports.

### 4. 📅 Dynamic Daily Study Plan Generator
- Generates a customized daily revision schedule based on available study hours.
- Time distribution formula: **~50%** High Priority, **~30%** Medium Priority, **~20%** Low Priority.
- Dispatches formatted HTML revision agendas directly to student inboxes via Gmail SMTP.

### 5. 🎯 Interactive Diagnostic Quizzes
- Configurable by difficulty (**Easy**, **Medium**, **Hard**) and question count (**3**, **5**, **8**, **10**).
- Real-time scoring with instant feedback, explanations, and automatic recalibration of the student's weakness metrics.

---

## 📂 Repository Folder Structure

```
EduGuide-AI/
├── backend/                        # Node.js + Express API Backend
│   ├── .env.example                # Backend environment variable template
│   ├── package.json                # Backend dependencies and scripts
│   ├── server.js                   # Application entry point
│   └── src/
│       ├── config/
│       │   ├── db.js               # MongoDB connection setup
│       │   └── env.js              # Environment variable loader
│       ├── controllers/            # Route controllers
│       │   ├── analysisController.js
│       │   ├── authController.js
│       │   ├── chatController.js
│       │   ├── documentController.js
│       │   ├── performanceController.js
│       │   ├── quizController.js
│       │   ├── studyPlanController.js
│       │   └── subjectController.js
│       ├── middleware/
│       │   ├── authMiddleware.js   # JWT verification middleware
│       │   ├── errorMiddleware.js  # Global error handler
│       │   └── uploadMiddleware.js # Multer file upload configuration
│       ├── models/                 # Mongoose schemas
│       │   ├── ChatMessage.js
│       │   ├── ChatSession.js
│       │   ├── Document.js
│       │   ├── Performance.js
│       │   ├── Quiz.js
│       │   ├── QuizAttempt.js
│       │   ├── StudyPlan.js
│       │   ├── Subject.js
│       │   └── User.js
│       ├── routes/                 # Express API routes
│       ├── services/               # External services (Email / SMTP)
│       └── utils/                  # Logger and helper functions
│
├── frontend/                       # React 19 + Vite Frontend SPA
│   ├── index.html                  # HTML entry point
│   ├── package.json                # Frontend dependencies and scripts
│   ├── postcss.config.js
│   ├── tailwind.config.js          # Tailwind CSS design tokens & colors
│   ├── vite.config.js              # Vite configuration & dev server proxy
│   └── src/
│       ├── App.jsx                 # Routing and application layout
│       ├── main.jsx                # React DOM render entry
│       ├── components/             # Reusable modular UI components
│       │   ├── chatbot/            # ChatWindow, ChatSidebar, ChatInput, Prompts
│       │   ├── common/             # Button, Card, Input, Modal, Loader
│       │   ├── documents/          # DocumentList, DocumentUploader, Status
│       │   ├── layout/             # Navbar, Sidebar, MobileNavbar, PageLayout
│       │   ├── performance/        # WeaknessAnalysis, PerformanceTable
│       │   ├── quiz/               # QuizSetup, QuizQuestion, QuizResult
│       │   └── studyplan/          # StudySession, StudyDay, StudyProgress
│       ├── context/                # AuthContext & ThemeContext
│       ├── pages/                  # Page-level route views
│       │   ├── AIChat.jsx          # Academic RAG chat interface
│       │   ├── Dashboard.jsx       # Overview metrics & quick actions
│       │   ├── Documents.jsx       # Document management & status
│       │   ├── Login.jsx           # Student login & authentication
│       │   ├── Performance.jsx     # Marks & academic analysis
│       │   ├── Quiz.jsx            # Diagnostic quiz generator & history
│       │   ├── Register.jsx        # Student registration & onboarding
│       │   ├── Settings.jsx        # Account & Theme settings
│       │   └── StudyPlan.jsx       # Personalized revision schedule
│       ├── services/               # Frontend API clients (Axios)
│       └── styles/                 # Global styles and Tailwind imports
│
├── nlp-service/                    # Python FastAPI Microservice
│   ├── .env.example                # Python service environment template
│   ├── main.py                     # FastAPI application entry point
│   ├── requirements.txt            # Python dependencies (PyTorch, FAISS, etc.)
│   └── app/
│       ├── api/                    # FastAPI route handlers
│       │   ├── analysis.py         # Topic extraction & analysis
│       │   ├── chat.py             # RAG retrieval & LLM chat
│       │   ├── documents.py        # File processing & chunking
│       │   ├── embeddings.py       # Vector embedding endpoints
│       │   └── quiz.py             # Quiz question synthesis
│       ├── config/
│       │   └── settings.py         # Pydantic environment configuration
│       └── services/               # NLP core engines
│           ├── docx_processor.py   # Word document parser
│           ├── embedding_service.py# SentenceTransformer model wrapper
│           ├── llm_service.py      # Google Gemini client & prompts
│           ├── pdf_processor.py    # PyMuPDF document parser
│           ├── rag_service.py      # Retrieval-Augmented Generation pipeline
│           ├── text_chunker.py     # Overlapping text sliding window
│           ├── text_processor.py   # Normalization & preprocessing
│           └── vector_store.py     # FAISS vector index manager
│
├── storage/                        # Local file & vector persistence
│   ├── uploads/                    # Uploaded student lecture notes & PDFs
│   └── vector_indexes/             # Serialized FAISS indices & chunk metadata
│
├── scripts/                        # Database management & setup utilities
│   ├── clearDatabase.js            # Clears collections for fresh testing
│   └── setup.js                    # Pre-flight environment check
│
├── docs/                           # Technical documentation & project reports
│   ├── api.md                      # Detailed API specification
│   ├── architecture.md             # System design & architecture details
│   ├── database.md                 # Database schema definitions
│   └── project-report.md           # Comprehensive project summary
│
├── .gitignore                      # Git ignored files & secret patterns
└── README.md                       # Project documentation (this file)
```

---

## ⚙ Prerequisites

Ensure you have the following installed on your machine:

1. **Node.js**: `v18.x` or `v20.x` LTS ([Download Node.js](https://nodejs.org/))
2. **Python**: `3.10.x` or `3.11.x` ([Download Python](https://www.python.org/))
3. **MongoDB**: Local Community Server ([Download MongoDB](https://www.mongodb.com/try/download/community)) or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI.
4. **Google Gemini API Key**: Free tier available from [Google AI Studio](https://aistudio.google.com/).

---

## 🔑 Configuration & Environment Variables

### 1. Backend Configuration (`backend/.env`)

Copy the template:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/eduguide_ai
JWT_SECRET=your_jwt_secret_key_academic_2026
JWT_EXPIRES_IN=7d
NLP_SERVICE_URL=http://127.0.0.1:8000
UPLOAD_DIR=../storage/uploads
NODE_ENV=development

# Optional: Gmail SMTP settings for sending study schedule emails
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_gmail_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

> **Note on Gmail SMTP**: If you want to use the email study plan feature, generate an **App Password** from your Google Account settings (Security → 2-Step Verification → App Passwords).

### 2. Python NLP Service Configuration (`nlp-service/.env`)

Copy the template:
```bash
cp nlp-service/.env.example nlp-service/.env
```

Edit `nlp-service/.env`:
```env
PORT=8000
HOST=0.0.0.0
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
EMBEDDING_MODEL=all-MiniLM-L6-v2
VECTOR_DB_PATH=../storage/vector_indexes
UPLOAD_DIR=../storage/uploads
```

---

## 🚀 Step-by-Step Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Shreyas142004/EduGuide-AI.git
cd EduGuide-AI
```

### Step 2: Set Up Python NLP Microservice
Navigate to the `nlp-service` folder and create a virtual environment:

**On Windows (PowerShell):**
```powershell
cd nlp-service
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

**On macOS / Linux:**
```bash
cd nlp-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 3: Set Up Node.js Backend
From the project root:
```bash
cd backend
npm install
```

### Step 4: Set Up React Frontend
From the project root:
```bash
cd frontend
npm install
```

---

## 💻 How to Run the Project

To run the complete platform, start the three services in separate terminal tabs or windows.

### Terminal 1: Python NLP Microservice
```powershell
# From the project root
cd nlp-service
.\venv\Scripts\activate
python main.py
```
*Microservice will start on: **`http://localhost:8000`***  
*Interactive Swagger docs available at: **`http://localhost:8000/docs`***  
*Health Check: **`http://localhost:8000/nlp/health`***

---

### Terminal 2: Node.js Express Backend
```bash
# From the project root
cd backend
npm start
```
*Backend server will start on: **`http://localhost:5000`***  
*Health Check: **`http://localhost:5000/api/health`***

---

### Terminal 3: React Vite Frontend
```bash
# From the project root
cd frontend
npm run dev
```
*Frontend application will start on: **`http://localhost:5173`***

---

## 🌐 Opening the Application

1. Open your browser and navigate to **`http://localhost:5173`**.
2. **Register a Student Profile**: Enter your name, email, target study hours, semester, and subjects.
3. **Upload Study Documents**: Go to **Documents** and upload your lecture slides or syllabus (`.pdf`, `.docx`, or `.txt`).
4. **View Academic Analysis**: Go to **Performance** to view weakness scores and topic distributions.
5. **Generate Study Plan**: Go to **Study Plan** to get your personalized daily schedule, and optionally email it to yourself.
6. **Chat with AI**: Go to **AI Assistant** to ask questions grounded directly in your uploaded notes.
7. **Take Diagnostic Quizzes**: Go to **Quiz** to generate MCQs from your materials and test your mastery.

---

## 📡 API Endpoints Overview

| Service | Method | Route | Description |
|---|---|---|---|
| **Backend** | `POST` | `/api/auth/register` | Register new student profile |
| **Backend** | `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| **Backend** | `GET` | `/api/auth/profile` | Get current authenticated profile |
| **Backend** | `GET/POST`| `/api/subjects` | List and create subjects |
| **Backend** | `POST` | `/api/documents/upload` | Upload study materials (PDF/DOCX/TXT) |
| **Backend** | `GET` | `/api/performance` | Retrieve student marks and academic history |
| **Backend** | `GET` | `/api/analysis/weaknesses` | Calculate multi-factor weakness scores |
| **Backend** | `POST` | `/api/study-plan/generate`| Generate prioritized daily study timetable |
| **Backend** | `POST` | `/api/study-plan/email` | Email personalized study plan via Gmail SMTP |
| **Backend** | `POST` | `/api/chat/message` | Send message to RAG tutor with source citations |
| **Backend** | `POST` | `/api/quiz/generate` | Synthesize diagnostic quiz questions |
| **Backend** | `POST` | `/api/quiz/submit` | Submit quiz attempt and update weaknesses |
| **NLP Microservice** | `GET` | `/nlp/health` | Check embedding model and Gemini connection |
| **NLP Microservice** | `POST`| `/nlp/process-document` | Parse text and build FAISS vector index |
| **NLP Microservice** | `POST`| `/nlp/rag/query` | Retrieve relevant chunks and synthesize answer |

For complete request/response schemas, refer to [docs/api.md](docs/api.md).

---

## 🛠 Troubleshooting & FAQs

### 1. `Error: listen EADDRINUSE: address already in use :::5000`
Another Node.js instance is running on port 5000.  
**Fix (Windows PowerShell):**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### 2. `Failed to dispatch email: Email service is not configured`
Ensure `EMAIL_USER` and `EMAIL_PASS` in `backend/.env` are populated with your Gmail address and a valid 16-character **Google App Password**.

### 3. `Python NLP Service: ModuleNotFoundError`
Ensure your virtual environment is active (`.\venv\Scripts\activate` on Windows) and you ran `pip install -r requirements.txt`.

### 4. `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`
MongoDB is not running locally. Start the MongoDB service via Windows Services or run:
```powershell
net start MongoDB
```
Or update `MONGO_URI` in `backend/.env` to point to your MongoDB Atlas cluster.

### 5. `Gemini API quota or key errors`
Ensure you set a valid Gemini API key in `nlp-service/.env`. You can test if it is configured by visiting `http://localhost:8000/nlp/health`.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
