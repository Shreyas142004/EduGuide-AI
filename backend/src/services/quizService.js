const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Performance = require('../models/Performance');
const Subject = require('../models/Subject');
const nlpService = require('./nlpService');
const { calculateSubjectPriority } = require('./weaknessService');
const logger = require('../utils/logger');

const quizService = {
  createQuiz: async ({ userId, subjectId, topic, count = 5, difficulty = 'Medium' }) => {
    const subject = await Subject.findOne({ _id: subjectId, userId });
    if (!subject) {
      throw new Error('Subject not found');
    }

    // Request questions from NLP service
    const nlpQuizData = await nlpService.generateQuiz({
      subjectId,
      subjectName: subject.name,
      topic,
      count,
      difficulty,
    });

    const quiz = await Quiz.create({
      userId,
      subjectId,
      topic: topic || 'Comprehensive Review',
      questions: nlpQuizData.questions || [],
    });

    return quiz;
  },

  submitQuiz: async ({ userId, quizId, answers }) => {
    const quiz = await Quiz.findOne({ _id: quizId, userId }).populate('subjectId');
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;
    const topicAccuracy = {}; // topic -> { correct: 0, total: 0 }
    const topicResults = [];

    quiz.questions.forEach((q, index) => {
      const userAnswer = answers[index] !== undefined ? Number(answers[index]) : -1;
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      const qTopic = q.topic || quiz.topic || 'General';
      if (!topicAccuracy[qTopic]) {
        topicAccuracy[qTopic] = { correct: 0, total: 0 };
      }
      topicAccuracy[qTopic].total += 1;
      if (isCorrect) topicAccuracy[qTopic].correct += 1;

      topicResults.push({
        topic: qTopic,
        question: q.question,
        isCorrect,
        userAnswer,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      });
    });

    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Record quiz attempt
    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      subjectId: quiz.subjectId._id,
      score: correctCount,
      totalQuestions,
      percentage,
      topicResults,
    });

    // Update Performance record for this subject
    let performance = await Performance.findOne({
      userId,
      subjectId: quiz.subjectId._id,
    });

    if (performance) {
      // Running average for quizScore
      const previousQuizScore = performance.quizScore || percentage;
      const newQuizScore = Math.round((previousQuizScore + percentage) / 2);
      performance.quizScore = newQuizScore;

      // Update topicScores
      const topicMap = new Map();
      (performance.topicScores || []).forEach(ts => topicMap.set(ts.topic.toLowerCase(), ts));

      for (const [topName, stats] of Object.entries(topicAccuracy)) {
        const topPct = Math.round((stats.correct / stats.total) * 100);
        const topStatus = topPct >= 75 ? 'Strong' : topPct >= 60 ? 'Moderate' : 'Weak';
        const key = topName.toLowerCase();

        if (topicMap.has(key)) {
          const existing = topicMap.get(key);
          existing.percentage = Math.round((existing.percentage + topPct) / 2);
          existing.status = existing.percentage >= 75 ? 'Strong' : existing.percentage >= 60 ? 'Moderate' : 'Weak';
          existing.lastTestedAt = new Date();
        } else {
          performance.topicScores.push({
            topic: topName,
            percentage: topPct,
            status: topStatus,
            lastTestedAt: new Date(),
          });
        }
      }

      // Recalculate priority
      const priorityInfo = calculateSubjectPriority(
        performance.examScore,
        performance.maxScore,
        performance.previousScore,
        performance.assignmentScore,
        newQuizScore
      );

      performance.priority = priorityInfo.priority;
      performance.percentage = Math.round((performance.examScore / performance.maxScore) * 100);
      performance.updatedAt = new Date();
      await performance.save();
    }

    return {
      attempt,
      score: correctCount,
      totalQuestions,
      percentage,
      topicResults,
      updatedPerformance: performance,
    };
  },
};

module.exports = quizService;
