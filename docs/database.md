# EduGuide AI – MongoDB Schema Design

The application utilizes MongoDB via Mongoose. Below is the structural schema specification for all 9 collections.

## 1. User (`users`)
- `_id`: ObjectId
- `name`: String (required)
- `email`: String (unique, required)
- `password`: String (bcrypt hashed, min length 6, excluded by default)
- `course`: String (e.g. "MCA")
- `semester`: Number (e.g. 3)
- `academicYear`: String (e.g. "2025-2026")
- `dailyStudyTime`: Number (available minutes per day, e.g. 180)
- `examDate`: Date
- `createdAt`: Date

## 2. Subject (`subjects`)
- `_id`: ObjectId
- `userId`: ObjectId -> User
- `name`: String (e.g. "AI/ML")
- `code`: String (e.g. "CS301")
- `createdAt`: Date
- *Compound unique index*: `(userId, name)`

## 3. Performance (`performances`)
- `_id`: ObjectId
- `userId`: ObjectId -> User
- `subjectId`: ObjectId -> Subject
- `examScore`: Number
- `maxScore`: Number (default 100)
- `previousScore`: Number
- `assignmentScore`: Number
- `quizScore`: Number
- `percentage`: Number (0–100)
- `priority`: String enum (`'HIGH'`, `'MEDIUM'`, `'LOW'`)
- `topicScores`: Array of Objects:
  - `topic`: String
  - `percentage`: Number
  - `status`: String (`'Weak'`, `'Moderate'`, `'Strong'`)
  - `lastTestedAt`: Date
- `createdAt`: Date
- `updatedAt`: Date
- *Compound unique index*: `(userId, subjectId)`

## 4. Document (`documents`)
- `_id`: ObjectId
- `userId`: ObjectId -> User
- `subjectId`: ObjectId -> Subject
- `filename`: String (sanitized storage filename)
- `originalName`: String (original uploaded filename)
- `fileType`: String (`'pdf'`, `'docx'`, `'txt'`)
- `filePath`: String
- `fileSize`: Number
- `processingStatus`: String (`'Uploading'`, `'Processing'`, `'Indexing'`, `'Ready'`, `'Failed'`)
- `pageCount`: Number
- `chunkCount`: Number
- `extractedTopics`: Array of Strings
- `errorMessage`: String
- `uploadedAt`: Date

## 5. ChatSession (`chatsessions`)
- `_id`: ObjectId
- `userId`: ObjectId -> User
- `title`: String
- `subjectId`: ObjectId -> Subject (optional filter)
- `documentId`: ObjectId -> Document (optional filter)
- `createdAt`: Date
- `updatedAt`: Date

## 6. ChatMessage (`chatmessages`)
- `_id`: ObjectId
- `sessionId`: ObjectId -> ChatSession
- `role`: String (`'user'`, `'assistant'`, `'system'`)
- `content`: String
- `sources`: Array of Objects:
  - `filename`: String
  - `pageNumber`: Number
  - `excerpt`: String
  - `subject`: String
  - `score`: Number
- `createdAt`: Date

## 7. StudyPlan (`studyplans`)
- `_id`: ObjectId
- `userId`: ObjectId -> User
- `date`: String (Format: `YYYY-MM-DD`)
- `sessions`: Array of Objects:
  - `subjectId`: ObjectId -> Subject
  - `subjectName`: String
  - `durationMinutes`: Number
  - `priority`: String (`'HIGH'`, `'MEDIUM'`, `'LOW'`)
  - `focusTopics`: Array of Strings
  - `actionableTasks`: Array of Strings
  - `completed`: Boolean
- `totalStudyTime`: Number (minutes)
- `completedTime`: Number (minutes)
- `status`: String (`'Active'`, `'Completed'`, `'Archived'`)
- `createdAt`: Date

## 8. Quiz (`quizzes`)
- `_id`: ObjectId
- `userId`: ObjectId -> User
- `subjectId`: ObjectId -> Subject
- `topic`: String
- `questions`: Array of Objects:
  - `question`: String
  - `options`: Array of 4 Strings
  - `correctAnswer`: Number (index 0 to 3)
  - `explanation`: String
  - `topic`: String
- `createdAt`: Date

## 9. QuizAttempt (`quizattempts`)
- `_id`: ObjectId
- `userId`: ObjectId -> User
- `quizId`: ObjectId -> Quiz
- `subjectId`: ObjectId -> Subject
- `score`: Number
- `totalQuestions`: Number
- `percentage`: Number
- `topicResults`: Array of Objects:
  - `topic`: String
  - `question`: String
  - `isCorrect`: Boolean
  - `userAnswer`: Number
  - `correctAnswer`: Number
  - `explanation`: String
- `completedAt`: Date
