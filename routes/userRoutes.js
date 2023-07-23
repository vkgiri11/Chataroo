import express from 'express';

import authMiddeware from '../middleware/auth.js';
import { registerUser, loginUser, getUsersBySearch } from '../controllers/user.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', authMiddeware, getUsersBySearch);

export default router;
