import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserModal from '../models/user.js';

dotenv.config();

export const registerUser = async (req, res) => {
	const { name, email, password, pic } = req.body;

	if (!name || !email || !password)
		return res.status(400).json({ message: 'Please Enter all fields!!' });

	try {
		const existingUser = await UserModal.findOne({ email });

		if (existingUser) return res.status(400).json({ message: 'User already exists' });

		const result = await UserModal.create({
			email,
			password,
			name,
			pic,
		});

		const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET, {
			expiresIn: '30m',
		});

		res.status(201).json({
			_id: result._id,
			name: result.name,
			email: result.email,
			createdAt: result.createdAt,
			token,
		});
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong' });
		console.log(error);
	}
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const existingUser = await UserModal.findOne({ email });

		if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

		const isPasswordCorrect = await existingUser.matchPassword(password);

		if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

		const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, {
			expiresIn: '30m',
		});

		res.status(200).json({
			_id: existingUser._id,
			name: existingUser.name,
			email: existingUser.email,
			createdAt: existingUser.createdAt,
			token,
		});
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong' });
		console.log(error);
	}
};
