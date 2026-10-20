/**
 * Academic Weakness Analysis Service
 * Implements performance-based weakness scoring and priority classification.
 * Strictly adheres to academic weakness guidance (no false claims of scientific validation).
 */

const calculateSubjectPriority = (examScore, maxScore = 100, previousScore = null, assignmentScore = null, quizScore = null) => {
  const currentExamPct = (examScore / maxScore) * 100;
  
  // Weighted performance calculation
  let weightedScore = currentExamPct;
  let weightsSum = 1.0;

  if (quizScore !== null && quizScore !== undefined && quizScore >= 0) {
    weightedScore += (quizScore * 0.35);
    weightsSum += 0.35;
  }
  if (assignmentScore !== null && assignmentScore !== undefined && assignmentScore >= 0) {
    weightedScore += (assignmentScore * 0.15);
    weightsSum += 0.15;
  }
  if (previousScore !== null && previousScore !== undefined && previousScore >= 0) {
    weightedScore += (previousScore * 0.20);
    weightsSum += 0.20;
  }

  const effectivePercentage = Math.round(weightedScore / weightsSum);

  let status = 'Moderate';
  let priority = 'MEDIUM';

  if (effectivePercentage >= 90) {
    status = 'Excellent';
    priority = 'LOW';
  } else if (effectivePercentage >= 75) {
    status = 'Strong';
    priority = 'LOW';
  } else if (effectivePercentage >= 60) {
    status = 'Moderate';
    priority = 'MEDIUM';
  } else {
    status = 'Weak';
    priority = 'HIGH';
  }

  return {
    effectivePercentage,
    status,
    priority,
  };
};

const generateSubjectExplanation = (subjectName, performance, allPerformances = []) => {
  const { examScore, maxScore, percentage, priority, quizScore, previousScore, topicScores } = performance;
  
  const weakTopics = (topicScores || []).filter(t => t.percentage < 60).map(t => t.topic);
  const topicsText = weakTopics.length > 0 
    ? ` Specifically, topic evaluations indicate needed practice in ${weakTopics.slice(0, 3).join(', ')}.`
    : '';

  if (priority === 'HIGH') {
    let reason = `${subjectName} is marked as High Priority because your recorded score of ${percentage}% is below 60%.`;
    if (quizScore !== undefined && quizScore < 60) {
      reason = `${subjectName} is marked as High Priority because both your exam score (${percentage}%) and recent quiz performance (${quizScore}%) are below target benchmarks.${topicsText}`;
    } else {
      reason += topicsText;
    }
    return reason;
  }

  if (priority === 'MEDIUM') {
    return `${subjectName} is at Moderate Performance (${percentage}%). Continuing targeted revisions will help reinforce core concepts into the strong tier.${topicsText}`;
  }

  return `${subjectName} is in Strong Performance (${percentage}%). Keep up steady periodic review sessions to retain mastery.`;
};

const analyzeStudentWeaknesses = (performances, subjects) => {
  const subjectMap = new Map();
  subjects.forEach(s => subjectMap.set(s._id.toString(), s.name));

  const analyzed = performances.map(p => {
    const subjectName = subjectMap.get(p.subjectId.toString()) || 'Unknown Subject';
    const explanation = generateSubjectExplanation(subjectName, p, performances);

    const weakTopics = (p.topicScores || []).filter(t => t.percentage < 60);
    const moderateTopics = (p.topicScores || []).filter(t => t.percentage >= 60 && t.percentage < 75);
    const strongTopics = (p.topicScores || []).filter(t => t.percentage >= 75);

    return {
      subjectId: p.subjectId,
      subjectName,
      examScore: p.examScore,
      maxScore: p.maxScore,
      percentage: p.percentage,
      priority: p.priority,
      quizScore: p.quizScore,
      assignmentScore: p.assignmentScore,
      previousScore: p.previousScore,
      status: p.percentage >= 90 ? 'Excellent' : p.percentage >= 75 ? 'Strong' : p.percentage >= 60 ? 'Moderate' : 'Weak',
      explanation,
      weakTopics,
      moderateTopics,
      strongTopics,
      topicScores: p.topicScores || [],
    };
  });

  // Sort by priority: HIGH first, then MEDIUM, then LOW
  const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
  analyzed.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || a.percentage - b.percentage);

  const highPriority = analyzed.filter(s => s.priority === 'HIGH');
  const mediumPriority = analyzed.filter(s => s.priority === 'MEDIUM');
  const lowPriority = analyzed.filter(s => s.priority === 'LOW');

  const overallScore = analyzed.length > 0
    ? Math.round(analyzed.reduce((acc, s) => acc + s.percentage, 0) / analyzed.length)
    : 0;

  return {
    overallScore,
    totalSubjects: analyzed.length,
    counts: {
      high: highPriority.length,
      medium: mediumPriority.length,
      low: lowPriority.length,
    },
    highPriority,
    mediumPriority,
    lowPriority,
    allSubjects: analyzed,
  };
};

module.exports = {
  calculateSubjectPriority,
  generateSubjectExplanation,
  analyzeStudentWeaknesses,
};
