import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserModal from '../models/user.js';

dotenv.config();

const secret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
		try {
			const token = req.headers.authorization.split(' ')[1];

			const decodedData = jwt.verify(token, secret);

			req.user = await UserModal.findById(decodedData.id).select('-password');

			next();
		} catch (error) {
			res.status(401);
			console.log(`Not authorized =====>> ${error}`);
		}
};

export default auth;
