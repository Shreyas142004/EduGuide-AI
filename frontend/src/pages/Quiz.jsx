import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import PageLayout from '../components/layout/PageLayout';
import QuizSetup from '../components/quiz/QuizSetup';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizResult from '../components/quiz/QuizResult';
import QuizHistory from '../components/quiz/QuizHistory';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import quizService from '../services/quizService';
import performanceService from '../services/performanceService';
import { HelpCircle, History, Play } from 'lucide-react';

const Quiz = () => {
  const [subjects, setSubjects] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Flow State: 'setup' | 'taking' | 'result'
  const [flowState, setFlowState] = useState('setup');
  const [activeTab, setActiveTab] = useState('take'); // 'take' | 'history'

  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subsRes, histRes] = await Promise.all([
        performanceService.getSubjects(),
        quizService.getQuizHistory(),
      ]);

      if (subsRes.success) setSubjects(subsRes.subjects || []);
      if (histRes.success) setAttempts(histRes.attempts || []);
    } catch (err) {
      console.error('Quiz page load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartQuiz = async ({ subjectId, topic, count, difficulty = 'Medium' }) => {
    try {
      setGenerating(true);
      const res = await quizService.generateQuiz(subjectId, topic, count, difficulty);
      if (res.success && res.quiz) {
        setCurrentQuiz(res.quiz);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setFlowState('taking');
        toast.success(`Generated ${res.quiz.questions.length} quiz questions on ${topic}!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;
    try {
      setSubmitting(true);
      const answersArray = currentQuiz.questions.map((_, idx) =>
        answers[idx] !== undefined ? answers[idx] : -1
      );

      const res = await quizService.submitQuiz(currentQuiz._id, answersArray);
      if (res.success) {
        setQuizResult(res.result);
        setFlowState('result');
        toast.success(`Quiz completed! You scored ${res.result.percentage}%`);
        // Refresh history in background
        quizService.getQuizHistory().then((h) => {
          if (h.success) setAttempts(h.attempts || []);
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setFlowState('setup');
    setCurrentQuiz(null);
    setAnswers({});
    setQuizResult(null);
  };

  return (
    <PageLayout
      title="Interactive Diagnostic Quiz"
      subtitle="Test your comprehension on specific topics. Submitting directly recalculates your subject and topic weakness analysis."
      actions={
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === 'take' ? 'primary' : 'outline'}
            size="sm"
            icon={Play}
            onClick={() => {
              setActiveTab('take');
              if (flowState !== 'taking') setFlowState('setup');
            }}
          >
            Take Quiz
          </Button>
          <Button
            variant={activeTab === 'history' ? 'primary' : 'outline'}
            size="sm"
            icon={History}
            onClick={() => setActiveTab('history')}
          >
            Attempt History
          </Button>
        </div>
      }
    >
      {loading ? (
        <Loader message="Loading diagnostic quiz module..." />
      ) : activeTab === 'history' ? (
        <QuizHistory attempts={attempts} />
      ) : (
        <div>
          {flowState === 'setup' && (
            <QuizSetup
              subjects={subjects}
              onGenerateQuiz={handleStartQuiz}
              loading={generating}
            />
          )}

          {flowState === 'taking' && currentQuiz && (
            <QuizQuestion
              question={currentQuiz.questions[currentQuestionIndex]}
              currentIndex={currentQuestionIndex}
              totalQuestions={currentQuiz.questions.length}
              selectedAnswer={answers[currentQuestionIndex]}
              onSelectAnswer={handleSelectAnswer}
              onNext={() => setCurrentQuestionIndex((prev) => prev + 1)}
              onSubmit={handleSubmitQuiz}
              isSubmitting={submitting}
            />
          )}

          {flowState === 'result' && quizResult && (
            <QuizResult result={quizResult} onRetake={handleRetake} />
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default Quiz;
