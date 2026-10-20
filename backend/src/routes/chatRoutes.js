const express = require('express');
const router = express.Router();
const { sendMessage, getSessions, getSessionById, deleteSession } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', sendMessage);
router.get('/sessions', getSessions);
router.get('/sessions/:id', getSessionById);
router.delete('/sessions/:id', deleteSession);

module.exports = router;
