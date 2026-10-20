const Performance = require('../models/Performance');
const Subject = require('../models/Subject');
const { calculateSubjectPriority } = require('./weaknessService');

const performanceService = {
  getStudentPerformances: async (userId) => {
    const performances = await Performance.find({ userId }).populate('subjectId');
    return performances;
  },

  upsertPerformance: async (userId, data) => {
    const { subjectId, examScore, maxScore = 100, previousScore, assignmentScore, quizScore } = data;

    const percentage = Math.round((Number(examScore) / Number(maxScore)) * 100);
    const priorityInfo = calculateSubjectPriority(
      Number(examScore),
      Number(maxScore),
      previousScore !== undefined ? Number(previousScore) : null,
      assignmentScore !== undefined ? Number(assignmentScore) : null,
      quizScore !== undefined ? Number(quizScore) : null
    );

    let performance = await Performance.findOne({ userId, subjectId });

    if (performance) {
      performance.examScore = Number(examScore);
      performance.maxScore = Number(maxScore);
      if (previousScore !== undefined) performance.previousScore = Number(previousScore);
      if (assignmentScore !== undefined) performance.assignmentScore = Number(assignmentScore);
      if (quizScore !== undefined) performance.quizScore = Number(quizScore);
      performance.percentage = percentage;
      performance.priority = priorityInfo.priority;
      performance.updatedAt = new Date();
      await performance.save();
    } else {
      performance = await Performance.create({
        userId,
        subjectId,
        examScore: Number(examScore),
        maxScore: Number(maxScore),
        previousScore: previousScore !== undefined ? Number(previousScore) : 0,
        assignmentScore: assignmentScore !== undefined ? Number(assignmentScore) : 0,
        quizScore: quizScore !== undefined ? Number(quizScore) : 0,
        percentage,
        priority: priorityInfo.priority,
        topicScores: [],
      });
    }

    return await performance.populate('subjectId');
  },
};

module.exports = performanceService;
