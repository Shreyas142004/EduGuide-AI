const express = require('express');
const router = express.Router();
const { getPerformances, upsertPerformance, updateTopicPerformance } = require('../controllers/performanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getPerformances)
  .post(upsertPerformance);

router.post('/:subjectId/topics', updateTopicPerformance);

module.exports = router;
