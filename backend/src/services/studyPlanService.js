/**
 * Dynamic Study Plan Generation Service
 * Distributes available daily study time dynamically according to priority tiers:
 * High Priority: ~50%
 * Medium Priority: ~30%
 * Low Priority: ~20%
 * Gracefully recalculates if a priority tier has 0 subjects.
 */

const generateDynamicStudyPlan = ({
  subjects,
  performances,
  dailyStudyTimeMinutes = 180,
  examDate = null,
}) => {
  const subjectMap = new Map();
  subjects.forEach(s => subjectMap.set(s._id.toString(), s.name));

  const highPriority = [];
  const mediumPriority = [];
  const lowPriority = [];

  performances.forEach(p => {
    const sName = subjectMap.get(p.subjectId.toString()) || 'Subject';
    const weakTopics = (p.topicScores || []).filter(t => t.percentage < 60).map(t => t.topic);
    const item = {
      subjectId: p.subjectId,
      subjectName: sName,
      priority: p.priority,
      percentage: p.percentage,
      weakTopics,
      allTopics: (p.topicScores || []).map(t => t.topic),
    };

    if (p.priority === 'HIGH') {
      highPriority.push(item);
    } else if (p.priority === 'MEDIUM') {
      mediumPriority.push(item);
    } else {
      lowPriority.push(item);
    }
  });

  // Calculate target tier weights based on presence
  let highWeight = highPriority.length > 0 ? 0.50 : 0;
  let medWeight = mediumPriority.length > 0 ? 0.30 : 0;
  let lowWeight = lowPriority.length > 0 ? 0.20 : 0;

  const totalWeight = highWeight + medWeight + lowWeight;
  if (totalWeight > 0) {
    highWeight = highWeight / totalWeight;
    medWeight = medWeight / totalWeight;
    lowWeight = lowWeight / totalWeight;
  }

  const highTimeTotal = Math.round(dailyStudyTimeMinutes * highWeight);
  const medTimeTotal = Math.round(dailyStudyTimeMinutes * medWeight);
  const lowTimeTotal = dailyStudyTimeMinutes - highTimeTotal - medTimeTotal;

  const sessions = [];

  // Distribute high priority time
  if (highPriority.length > 0) {
    const timePerSubject = Math.max(15, Math.floor(highTimeTotal / highPriority.length));
    highPriority.forEach((subj, idx) => {
      // Allocate leftover to first items
      const duration = (idx === highPriority.length - 1)
        ? Math.max(15, highTimeTotal - (timePerSubject * (highPriority.length - 1)))
        : timePerSubject;
      
      const focus = subj.weakTopics.length > 0
        ? subj.weakTopics.slice(0, 3)
        : ['Core fundamentals', 'Complex concepts', 'Exam question patterns'];

      sessions.push({
        subjectId: subj.subjectId,
        subjectName: subj.subjectName,
        durationMinutes: duration,
        priority: 'HIGH',
        focusTopics: focus,
        actionableTasks: [
          `Review uploaded study materials for ${focus.join(', ')}`,
          `Ask AI Assistant for step-by-step 10-mark breakdowns`,
          `Complete an evaluation quiz on ${focus[0] || 'core concepts'}`,
        ],
        completed: false,
      });
    });
  }

  // Distribute medium priority time
  if (mediumPriority.length > 0) {
    const timePerSubject = Math.max(15, Math.floor(medTimeTotal / mediumPriority.length));
    mediumPriority.forEach((subj, idx) => {
      const duration = (idx === mediumPriority.length - 1)
        ? Math.max(15, medTimeTotal - (timePerSubject * (mediumPriority.length - 1)))
        : timePerSubject;
      
      const focus = subj.weakTopics.length > 0
        ? subj.weakTopics.slice(0, 2)
        : ['Reinforcement practice', 'Key definitions', 'Formulae & derivations'];

      sessions.push({
        subjectId: subj.subjectId,
        subjectName: subj.subjectName,
        durationMinutes: duration,
        priority: 'MEDIUM',
        focusTopics: focus,
        actionableTasks: [
          `Targeted revision of ${focus.join(' & ')}`,
          `Attempt 5-mark conceptual practice questions`,
        ],
        completed: false,
      });
    });
  }

  // Distribute low priority time
  if (lowPriority.length > 0) {
    const timePerSubject = Math.max(10, Math.floor(lowTimeTotal / lowPriority.length));
    lowPriority.forEach((subj, idx) => {
      const duration = (idx === lowPriority.length - 1)
        ? Math.max(10, lowTimeTotal - (timePerSubject * (lowPriority.length - 1)))
        : timePerSubject;

      sessions.push({
        subjectId: subj.subjectId,
        subjectName: subj.subjectName,
        durationMinutes: duration,
        priority: 'LOW',
        focusTopics: ['High-level recap', 'Flashcard review', 'Speed tests'],
        actionableTasks: [
          `Quick 15-minute concept consolidation`,
          `Take a rapid 5-question refresher quiz`,
        ],
        completed: false,
      });
    });
  }

  return {
    totalStudyTime: dailyStudyTimeMinutes,
    sessions,
  };
};

module.exports = {
  generateDynamicStudyPlan,
};
