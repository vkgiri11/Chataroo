import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import { getMessagesById, sendMessage } from '../controllers/messageController.js';


const router = express.Router();

router.post('/', authMiddleware, sendMessage)
router.get('/:chatId', authMiddleware, getMessagesById)

export default router;
