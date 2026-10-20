const StudyPlan = require('../models/StudyPlan');
const Performance = require('../models/Performance');
const Subject = require('../models/Subject');
const User = require('../models/User');
const { generateDynamicStudyPlan } = require('../services/studyPlanService');

// @desc    Generate a fresh personalized study plan
// @route   POST /api/study-plan/generate
// @access  Private
const generatePlan = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user.id);
    const subjects = await Subject.find({ userId: req.user.id });
    const performances = await Performance.find({ userId: req.user.id });

    if (subjects.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add subjects before generating a personalized study plan.',
      });
    }

    const planData = generateDynamicStudyPlan({
      subjects,
      performances,
      dailyStudyTimeMinutes: user.dailyStudyTime || 180,
      examDate: user.examDate,
    });

    // Check if a plan already exists for today
    let plan = await StudyPlan.findOne({ userId: req.user.id, date: today });

    if (plan) {
      plan.sessions = planData.sessions;
      plan.totalStudyTime = planData.totalStudyTime;
      plan.status = 'Active';
      await plan.save();
    } else {
      plan = await StudyPlan.create({
        userId: req.user.id,
        date: today,
        sessions: planData.sessions,
        totalStudyTime: planData.totalStudyTime,
        status: 'Active',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Personalized study plan generated successfully',
      studyPlan: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current active study plan
// @route   GET /api/study-plan
// @access  Private
const getStudyPlan = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let plan = await StudyPlan.findOne({ userId: req.user.id, date: today });

    if (!plan) {
      // Find the most recent active study plan
      plan = await StudyPlan.findOne({ userId: req.user.id }).sort({ date: -1 });
    }

    res.status(200).json({
      success: true,
      studyPlan: plan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update study plan session completion status
// @route   PUT /api/study-plan/:id
// @access  Private
const updateStudyPlan = async (req, res, next) => {
  try {
    const { sessionId, completed } = req.body;
    const plan = await StudyPlan.findOne({ _id: req.params.id, userId: req.user.id });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found' });
    }

    if (sessionId) {
      const session = plan.sessions.id(sessionId);
      if (session) {
        session.completed = Boolean(completed);
        
        // Recalculate completedTime
        plan.completedTime = plan.sessions.reduce(
          (acc, s) => s.completed ? acc + s.durationMinutes : acc,
          0
        );

        // Check if all sessions are completed
        const allDone = plan.sessions.every(s => s.completed);
        if (allDone) {
          plan.status = 'Completed';
        } else {
          plan.status = 'Active';
        }
      }
    }

    await plan.save();

    res.status(200).json({
      success: true,
      studyPlan: plan,
    });
  } catch (error) {
    next(error);
  }
};

const { sendStudyPlanEmail } = require('../services/emailService');

// @desc    Email the study plan to the student
// @route   POST /api/study-plan/email
// @access  Private
const emailStudyPlan = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let plan = await StudyPlan.findOne({ userId: req.user.id, date: today });
    if (!plan) {
      plan = await StudyPlan.findOne({ userId: req.user.id }).sort({ date: -1 });
    }

    if (!plan || !plan.sessions || plan.sessions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active study plan available to email. Please generate a plan first.',
      });
    }

    const user = await User.findById(req.user.id);
    const recipientEmail = user?.email || req.user?.email || process.env.EMAIL_USER || 'student@eduguide.ai';
    const studentName = user?.name || req.user?.name || 'Student';

    const emailResult = await sendStudyPlanEmail({
      to: recipientEmail,
      studentName,
      planDate: plan.date,
      sessions: plan.sessions,
    });

    return res.status(200).json({
      success: true,
      message: emailResult.message || `Personalized study plan successfully emailed to ${recipientEmail}`,
      simulated: !!emailResult.simulated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generatePlan,
  getStudyPlan,
  updateStudyPlan,
  emailStudyPlan,
};
