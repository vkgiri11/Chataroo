import UserModel from '../models/userModel.js';
import ChatModel from '../models/chatModel.js';

export const accessChat = async (req, res) => {
	const { userId } = req.body;

	if (!userId) return res.status(400).json({ message: 'User ID required.' });

	try {
		// if chat exists with this user
		let existingChat = await ChatModel.findOne({
			isGroupChat: false,
			$and: [
				{ users: { $elemMatch: { $eq: req.user._id } } },
				{ users: { $elemMatch: { $eq: userId } } },
			],
		})
			.populate('users', '-password')
			.populate('latestMessage');

		existingChat = await UserModel.populate(existingChat, {
			path: 'latestMessage.sender',
			select: 'name pic email',
		});

		if (existingChat?.length > 0) return res.status(200).json({ data: existingChat[0] });

		const chatData = {
			chatName: 'sender',
			isGroupChat: false,
			users: [req.user._id, userId],
		};

		const createNewChat = await ChatModel.create(chatData);

		const createdChat = await ChatModel.findOne({ _id: createNewChat._id }).populate(
			'users',
			'-password'
		);

		return res.status(200).json({ data: createdChat });
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong' });
		console.log(error);
	}
};

export const fetchChats = async (req, res) => {
	try {
		ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
			.populate('users', '-password')
			.populate('groupAdmin', '-password')
			.populate('latestMessage')
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				results = await UserModel.populate(results, {
					path: 'latestMessage.sender',
					select: 'name pic email',
				});

				res.status(200).send({ data: results });
			});
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong' });
		console.log(error);
	}
};
