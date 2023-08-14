import express from 'express';

import {
	accessChat,
	addToGroup,
	createGroupChat,
	fetchChats,
	removeFromGroup,
	renameGroupChat,
} from '../backend/controllers/chatController.js.js';
import authMiddleware from '../middleware/authMiddleWare.js';

const router = express.Router();

router.post('/', authMiddleware, accessChat);
router.get('/', authMiddleware, fetchChats);

router.post('/create_group', authMiddleware, createGroupChat);
router.put('/rename_group', authMiddleware, renameGroupChat);
router.put('/add_to_group', authMiddleware, addToGroup)
router.put('/remove_from_group', authMiddleware, removeFromGroup)

export default router;
