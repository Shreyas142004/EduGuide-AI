const express = require('express');
const router = express.Router();
const { getOverview, getWeakSubjects, getTopics } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/overview', getOverview);
router.get('/weak-subjects', getWeakSubjects);
router.get('/topics', getTopics);

module.exports = router;
