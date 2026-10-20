import os
import re
import json
from typing import Optional, Dict, Any, List
from app.config.settings import settings
from app.utils.text_utils import split_into_sentences

class LLMService:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.api_key = (
            settings.GEMINI_API_KEY
            or os.environ.get("GEMINI_API_KEY", "")
            or settings.LLM_API_KEY
            or os.environ.get("LLM_API_KEY", "")
        ).strip()
        
        self.model_name = (
            settings.GEMINI_MODEL
            or os.environ.get("GEMINI_MODEL", "")
            or settings.LLM_MODEL
            or os.environ.get("LLM_MODEL", "gemini-3.8-flash")
        ).strip()

        self._gemini_client = None
        self._init_gemini()

    def _init_gemini(self):
        if self.has_api_key():
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._gemini_client = genai.GenerativeModel(self.model_name)
                print(f"[Gemini] Initialized Google Gemini model: {self.model_name}")
            except Exception as e:
                print(f"[Gemini] Failed to configure google-generativeai SDK: {e}")
                self._gemini_client = None

    def has_api_key(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 5)

    def generate_completion(
        self,
        prompt: str,
        system_instruction: Optional[str] = None
    ) -> Optional[str]:
        """
        Sends prompt to Gemini API via direct high-performance REST API with model fallback.
        """
        if not self.has_api_key():
            return None

        import httpx
        candidate_models = [self.model_name, "gemini-3.5-flash", "gemini-3.5-flash-lite"]
        # Deduplicate while preserving order
        unique_models = []
        for m in candidate_models:
            if m and m not in unique_models:
                unique_models.append(m)

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"{system_instruction or ''}\n\n{prompt}".strip()}]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 1800
            }
        }

        for model in unique_models:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.api_key}"
                with httpx.Client(timeout=20.0) as client:
                    res = client.post(url, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts:
                                return parts[0].get("text", "").strip()
                    else:
                        print(f"[Gemini] Model {model} returned HTTP {res.status_code}: {res.text[:120]}")
            except Exception as e:
                print(f"[Gemini] Request error for {model}: {e}")

        # Fallback to SDK if REST failed
        if self._gemini_client is not None:
            try:
                full_prompt = f"{system_instruction}\n\n{prompt}" if system_instruction else prompt
                response = self._gemini_client.generate_content(
                    full_prompt,
                    generation_config={"temperature": 0.2, "max_output_tokens": 1800}
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"[Gemini] SDK fallback error: {e}")

        return None


    def generate_rag_answer(
        self,
        query: str,
        chunks: List[Dict[str, Any]],
        student_context: Optional[Dict[str, Any]] = None,
        history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """
        Grounded RAG synthesis using Google Gemini with student personalization and source citation.
        """
        if not chunks:
            return (
                "I couldn't find this information in your uploaded study material. "
                "Please upload relevant notes or verify your selected subject filter."
            )

        # Build context blocks from retrieved chunks
        context_blocks = []
        for idx, c in enumerate(chunks, 1):
            fname = c.get('filename', 'Document')
            pnum = c.get('page_number', 1)
            sname = c.get('subject_name', '')
            text = c.get('text', '')
            context_blocks.append(f"--- Document Source {idx}: {fname} (Page {pnum}, Subject: {sname}) ---\n{text}")
        
        context_text = "\n\n".join(context_blocks)

        # Build personalized system instructions
        weak_topics = student_context.get("weak_topics", []) if student_context else []
        high_priority = student_context.get("high_priority_subjects", []) if student_context else []

        personalization_note = ""
        if weak_topics or high_priority:
            personalization_note = (
                f"Student Focus:\n"
                f"- High Priority Subject: {', '.join(high_priority) if high_priority else 'None'}\n"
                f"- Weak Focus Topics: {', '.join(weak_topics) if weak_topics else 'None'}\n"
                f"Explain concepts extra simply and clearly for these topics."
            )

        system_prompt = f"""You are EduGuide AI, a helpful and friendly academic tutor.

CRITICAL INSTRUCTIONS FOR YOUR ANSWERS:
1. KEEP ANSWERS SIMPLE, SHORT, AND EASY TO UNDERSTAND.
2. AVOID complex academic jargon, overly dense paragraphs, or advanced textbook vocabulary. Speak in simple, friendly, everyday English so any student can understand instantly.
3. STRUCTURE YOUR ANSWER AS FOLLOWS:
   - **Simple Definition / Summary:** 1 to 2 clear, short sentences.
   - **Key Points:** 2 to 4 brief bullet points explaining the core idea.
   - **Everyday Example or Analogy:** 1 short sentence showing how it works in real life.
4. Keep the total response brief and readable (under 150-200 words).
5. If the student asks for a quick answer, be direct.
6. Base your answers on the provided document excerpts. If something is missing from the document, say simply: "I couldn't find this in your uploaded study material."

{personalization_note}"""

        prompt = f"""RELEVANT STUDY DOCUMENT EXCERPTS:
{context_text}

STUDENT QUESTION:
{query}

Please provide a short, simple, student-friendly explanation based on the document excerpts above."""

        gemini_response = self.generate_completion(prompt, system_instruction=system_prompt)
        if gemini_response:
            return gemini_response

        # Graceful fallback to local academic synthesizer if Gemini is unavailable
        return self.synthesize_academic_answer(query, chunks, student_context)

    def generate_quiz(
        self,
        subject: str,
        topic: str,
        context_chunks: List[Dict[str, Any]],
        num_questions: int = 5,
        difficulty: str = "Medium"
    ) -> List[Dict[str, Any]]:
        """
        Generates simple, student-friendly diagnostic quiz questions using Gemini and retrieved document context.
        Returns a list of question dicts matching QuizQuestionItem schema.
        """
        context_text = ""
        if context_chunks:
            context_text = "\n\n".join([f"[{c.get('filename')}, Page {c.get('page_number')}]: {c.get('text')}" for c in context_chunks[:6]])

        prompt = f"""You are EduGuide AI, creating a simple, beginner-friendly academic quiz for college students.
Generate {num_questions} simple multiple-choice questions for subject '{subject}' on topic '{topic}'.

CRITICAL QUIZ RULES:
1. KEEP QUESTIONS SIMPLE AND EASY TO UNDERSTAND.
   - Test fundamental, core definitions and basic concepts.
   - DO NOT make questions overly advanced, tricky, or complicated.
   - Question sentences must be short, clear, and direct (1 sentence).
2. PROVIDE 4 SIMPLE, SHORT OPTIONS (Option A, B, C, D).
   - Each option must be short (under 10 words).
   - Do NOT use confusing double negatives or trick questions.
   - Exactly one option must be correct.
3. PROVIDE A SHORT 1-SENTENCE EXPLANATION of why the correct option is right.
4. Return ONLY a valid JSON array of objects. No markdown formatting, no code blocks, no text before or after.

DOCUMENT EXCERPTS:
{context_text if context_text else f'Base questions on the basic concepts of {topic} in {subject}.'}

JSON Format:
[
  {{
    "question": "What is the main purpose of ...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Simple 1-sentence explanation.",
    "topic": "{topic}"
  }}
]"""

        gemini_raw = self.generate_completion(
            prompt,
            system_instruction="You are an academic evaluator creating a simple, beginner-friendly multiple choice quiz. Return only a valid JSON array."
        )

        if gemini_raw:
            try:
                # Clean any markdown code blocks
                cleaned = re.sub(r'```(?:json)?\s*', '', gemini_raw).strip()
                cleaned = re.sub(r'```', '', cleaned).strip()
                parsed = json.loads(cleaned)
                if isinstance(parsed, list) and len(parsed) > 0:
                    validated = []
                    for q in parsed:
                        if (
                            "question" in q
                            and isinstance(q.get("options"), list)
                            and len(q["options"]) >= 4
                            and "correctAnswer" in q
                        ):
                            validated.append({
                                "question": str(q["question"]),
                                "options": [str(opt) for opt in q["options"][:4]],
                                "correctAnswer": int(q["correctAnswer"]) % 4,
                                "explanation": str(q.get("explanation", "Correct based on course concepts.")),
                                "topic": str(q.get("topic", topic))
                            })
                    if len(validated) >= num_questions:
                        return validated[:num_questions]
                    elif validated:
                        return validated
            except Exception as e:
                print(f"[Gemini] Failed to parse quiz JSON: {e}")

        # Deterministic fallback generator if offline or invalid JSON
        return self._generate_fallback_quiz(subject, topic, context_chunks, num_questions)

    def _generate_fallback_quiz(
        self,
        subject: str,
        topic: str,
        context_chunks: List[Dict[str, Any]],
        num_questions: int
    ) -> List[Dict[str, Any]]:
        """Simple, beginner-friendly fallback quiz generator."""
        questions = []

        # Simple, beginner-friendly template bank
        templates = [
            {
                "question": f"What is the main purpose of {topic} in {subject}?",
                "options": [
                    f"To organize and process tasks efficiently",
                    "To shut down the computer system",
                    "To randomly erase stored data",
                    "To disable network communication"
                ],
                "correctAnswer": 0,
                "explanation": f"{topic} is used to organize and optimize operations in {subject}."
            },
            {
                "question": f"Which of the following is a key benefit of {topic}?",
                "options": [
                    "Better organization and fewer errors",
                    "Slower computer processing speed",
                    "Loss of file access permissions",
                    "Increased system crashes"
                ],
                "correctAnswer": 0,
                "explanation": f"{topic} improves organization and helps prevent common errors."
            },
            {
                "question": f"When learning {topic}, what should a student focus on first?",
                "options": [
                    "The basic definition and core purpose",
                    "Memorizing random binary numbers",
                    "Ignoring lecture notes completely",
                    "Skipping all practice exercises"
                ],
                "correctAnswer": 0,
                "explanation": f"Understanding the basic definition gives you the best starting foundation."
            },
            {
                "question": f"In {subject}, how is {topic} typically applied?",
                "options": [
                    "To solve practical and conceptual problems",
                    "To permanently freeze the screen",
                    "To delete the operating system",
                    "To unplug hardware devices"
                ],
                "correctAnswer": 0,
                "explanation": f"{topic} provides practical techniques to solve problems in {subject}."
            },
            {
                "question": f"Which statement about {topic} is true?",
                "options": [
                    "It is an important concept in the syllabus",
                    "It is never tested in academic exams",
                    "It has no relation to computer science",
                    "It was completely banned in universities"
                ],
                "correctAnswer": 0,
                "explanation": f"{topic} is an essential part of the curriculum."
            }
        ]

        for idx in range(min(num_questions, len(templates))):
            t = templates[idx]
            questions.append({
                "question": t["question"],
                "options": t["options"],
                "correctAnswer": t["correctAnswer"],
                "explanation": t["explanation"],
                "topic": topic
            })

        return questions

    def synthesize_academic_answer(
        self,
        query: str,
        chunks: List[Dict[str, Any]],
        student_context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Deterministic local academic answer synthesis matching document content.
        Used as primary method when external LLM is not configured, or if offline.
        """
        if not chunks:
            return "I couldn't find this information in your uploaded study material."

        keywords = set(re.findall(r'\b[a-zA-Z]{3,}\b', query.lower()))
        stop_words = {'what', 'when', 'where', 'which', 'who', 'whom', 'why', 'how',
                      'explain', 'describe', 'define', 'give', 'tell', 'show', 'difference',
                      'between', 'about', 'simple', 'words', 'example', 'exam', 'questions'}
        content_words = keywords - stop_words

        collected_points = []
        definition_candidates = []
        example_candidates = []

        for chunk in chunks:
            text = chunk.get("text", "")
            sentences = split_into_sentences(text)
            for s in sentences:
                s_lower = s.lower()
                matches = sum(1 for w in content_words if w in s_lower)
                if matches > 0:
                    if any(indicator in s_lower for indicator in ['is defined as', 'is a', 'refers to', 'means', 'consists of']):
                        definition_candidates.append(s)
                    elif any(indicator in s_lower for indicator in ['for example', 'such as', 'for instance', 'e.g.']):
                        example_candidates.append(s)
                    else:
                        collected_points.append(s)

        response_parts = []
        
        # Primary definition or simple summary
        if definition_candidates:
            response_parts.append(f"### Simple Summary\n\n{definition_candidates[0]}")
        elif collected_points:
            response_parts.append(f"### Simple Summary\n\n{collected_points[0]}")
            collected_points = collected_points[1:]
        else:
            first_chunk_text = chunks[0]["text"]
            sentences = split_into_sentences(first_chunk_text)
            overview = " ".join(sentences[:2]) if len(sentences) >= 2 else first_chunk_text
            response_parts.append(f"### Simple Summary\n\n{overview}")

        # 2-3 Key Points max
        unique_points = []
        seen_sents = set()
        for p in collected_points[:3]:
            snippet = p[:60].lower()
            if snippet not in seen_sents:
                seen_sents.add(snippet)
                unique_points.append(f"- {p}")

        if unique_points:
            response_parts.append("### Key Points\n\n" + "\n".join(unique_points))

        # Practical Example if found in notes
        if example_candidates:
            response_parts.append(f"### Example\n\n{example_candidates[0]}")

        # Personalization note for weak topics
        if student_context and student_context.get("weak_topics"):
            weak_topics = student_context.get("weak_topics", [])
            query_lower = query.lower()
            matching_weak = [t for t in weak_topics if t.lower() in query_lower]
            if matching_weak:
                response_parts.append(
                    f"> 💡 **Focus Tip:** **{matching_weak[0]}** is in your priority revision list. Practice its basic definition for quick marks."
                )

        return "\n\n".join(response_parts)
