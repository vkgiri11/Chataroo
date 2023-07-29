import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserModal from '../models/userModel.js';

dotenv.config();

const secret = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			token = req.headers.authorization.split(' ')[1];

			const decodedData = jwt.decode(token, secret);

			req.user = await UserModal.findById(decodedData.id).select('-password');

			next();
		} catch (error) {
			res.status(401);
			console.log(`Not authorized =====>> ${error}`);
		}
	}

	if (!token) {
		res.status(401);
		console.log('Not authorized, no token');
	}
};

export default authMiddleware;
