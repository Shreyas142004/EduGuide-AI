const express = require('express');
const router = express.Router();
const { generateQuiz, submitQuiz, getQuizHistory, getQuizById } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', generateQuiz);
router.post('/:id/submit', submitQuiz);
router.get('/history', getQuizHistory);
router.get('/:id', getQuizById);

module.exports = router;
