
import express from 'express';
import { processChatRequest } from '../controllers/aiChatLogic.js';

const router = express.Router();

// POST /api/ai-help/chat
router.post('/chat', processChatRequest);

export default router;
