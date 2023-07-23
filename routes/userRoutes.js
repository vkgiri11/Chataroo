import express from 'express';

import authMiddleware from '../middleware/auth.js';
import { registerUser, loginUser, getUsersBySearch } from '../controllers/user.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', authMiddleware, getUsersBySearch);

export default router;
