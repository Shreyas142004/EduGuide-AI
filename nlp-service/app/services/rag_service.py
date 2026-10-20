from typing import List, Dict, Any, Optional
from app.services.retrieval_service import RetrievalService
from app.services.llm_service import LLMService
from app.models.analysis_models import SourceReference, ChatResponse

class RAGService:
    def __init__(self):
        self.retrieval_service = RetrievalService()
        self.llm_service = LLMService.get_instance()

    def process_query(
        self,
        query: str,
        subject_id: Optional[str] = None,
        subject_name: Optional[str] = None,
        document_id: Optional[str] = None,
        student_context: Optional[Dict[str, Any]] = None,
        history: Optional[List[Dict[str, str]]] = None
    ) -> ChatResponse:
        """
        Executes the RAG pipeline with student personalization and source attribution.
        """
        q_clean = query.strip()
        q_lower = q_clean.lower()

        # Handle broad student guidance prompts (e.g. "what should I study?", "what should I revise today?")
        is_advisory_query = any(phrase in q_lower for phrase in [
            'what should i study', 'what to study', 'give me something to study',
            'what should i revise', 'study recommendation', 'where do i begin',
            'plan my revision', 'what are my weak'
        ])

        if is_advisory_query and student_context:
            return self._generate_personalized_study_advisory(student_context, subject_name)

        # Retrieve relevant chunks from FAISS
        chunks = self.retrieval_service.retrieve(
            query=q_clean,
            subject_id=subject_id,
            document_id=document_id,
            top_k=4,
            min_score=0.22
        )

        sources = []
        for c in chunks:
            text_preview = c.get("text", "")[:140].replace("\n", " ") + "..."
            sources.append(SourceReference(
                filename=c.get("filename", "Uploaded Material"),
                page_number=c.get("page_number", 1),
                excerpt=text_preview,
                subject=c.get("subject_name", ""),
                score=round(c.get("score", 0.0), 3)
            ))

        if not chunks:
            return ChatResponse(
                answer="Sorry, I couldn't find enough information about this topic in your uploaded study material. "
                       "Please try uploading the relevant lecture notes, slides, or chapter document, or verify the selected subject filter.",
                sources=[],
                suggested_questions=[
                    "What documents do I have uploaded?",
                    "What should I study today?",
                    "Test me on core subject concepts"
                ]
            )

        # Use central Gemini RAG synthesis service
        answer = self.llm_service.generate_rag_answer(
            query=q_clean,
            chunks=chunks,
            student_context=student_context,
            history=history
        )

        # Generate suggested follow-up questions
        suggested = [
            f"Explain this as a 10-mark answer.",
            f"Give me a real-world example.",
            f"Generate practice exam questions for this topic.",
            f"Test me with a quick quiz on this.",
        ]

        return ChatResponse(
            answer=answer,
            sources=sources,
            suggested_questions=suggested
        )

    def _generate_personalized_study_advisory(
        self,
        student_context: Dict[str, Any],
        subject_name: Optional[str] = None
    ) -> ChatResponse:
        high_priority = student_context.get("high_priority_subjects", [])
        weak_topics = student_context.get("weak_topics", [])
        daily_time = student_context.get("daily_study_time", 180)
        exam_date = student_context.get("exam_date", "Upcoming")
        student_name = student_context.get("student_name", "Student")

        hours = round(daily_time / 60, 1)

        lines = [
            f"### Personalized Revision Advisory for {student_name} 👋",
            f"Based on your recent academic performance and recorded evaluations:\n",
        ]

        if high_priority:
            lines.append(f"- **High Priority Subject:** **{', '.join(high_priority)}** is flagged as needing the most attention.")
        
        if weak_topics:
            lines.append(f"- **Weak Focus Topics:** Your quiz results indicate you should prioritize: **{', '.join(weak_topics[:4])}**.")

        lines.append(f"- **Available Study Budget:** You have allocated **{hours} hours** ({daily_time} minutes) today.")
        if exam_date:
            lines.append(f"- **Target Exam Date:** {exam_date}")

        lines.append("\n#### Recommended Study Plan for Today:")
        if high_priority:
            lines.append(f"1. **{high_priority[0]} (50% of time - ~{int(daily_time * 0.5)} mins):**")
            if weak_topics:
                lines.append(f"   - Deep-dive review on *{weak_topics[0]}* from your uploaded notes.")
            else:
                lines.append(f"   - Review foundational chapters and attempt exam practice questions.")
            lines.append(f"2. **Moderate Subjects (30% of time - ~{int(daily_time * 0.3)} mins):** Practice 5-mark conceptual problems.")
            lines.append(f"3. **Strong Subjects (20% of time - ~{int(daily_time * 0.2)} mins):** Quick 15-minute speed revision.")
        else:
            lines.append("1. Continue balanced revision across your subjects.")
            lines.append("2. Attempt topical quizzes to discover any emerging weak areas early.")

        lines.append("\n> Ready to begin? You can upload lecture slides, ask me to explain any topic, or generate an exam question paper!")

        return ChatResponse(
            answer="\n".join(lines),
            sources=[],
            suggested_questions=[
                "Explain the weak topics in simple words.",
                "Give me 5-mark questions for my weak subjects.",
                "Generate a quiz to test my readiness.",
            ]
        )
