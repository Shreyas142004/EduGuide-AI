const express = require('express');
const router = express.Router();
const { generatePlan, getStudyPlan, updateStudyPlan, emailStudyPlan } = require('../controllers/studyPlanController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', generatePlan);
router.get('/', getStudyPlan);
router.post('/email', emailStudyPlan);
router.put('/:id', updateStudyPlan);

module.exports = router;
