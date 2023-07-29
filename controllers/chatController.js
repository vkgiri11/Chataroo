import UserModel from '../models/userModel.js';
import ChatModel from '../models/chatModel.js';

export const accessChat = async (req, res) => {
	const { userId } = req.body;

	if (!userId) return res.status(400).json({ message: 'User ID required.' });

	try {
		// if chat exists with this user
		let existingChat = await ChatModel.find({
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

export const createGroupChat = async (req, res) => {
	const { users, group_name } = req.body;

	if (!users || !group_name)
		return res.status(400).send({ message: 'Please fill in all the fields.' });

	if (users.length < 2)
		return res.status(400).send({ message: 'More than 2 users required to form a group.' });

	users.push(req.user);
	try {
		const createGroupChat = await ChatModel.create({
			chatName: group_name,
			users,
			isGroupChat: true,
			groupAdmin: req.user,
		});

		const newGroup = await ChatModel.findOne({ _id: createGroupChat._id })
			.populate('users', '-password')
			.populate('groupAdmin', '-password');

		res.status(200).send({ data: newGroup });
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong' });
		console.log(error);
	}
};

export const renameGroupChat = async (req, res) => {
	const { groupName, groupId } = req.body;

	try {
		const updatedGroup = await ChatModel.findByIdAndUpdate(
			groupId,
			{ chatName: groupName },
			{ new: true }
		)
			.populate('users', '-password')
			.populate('groupAdmin', '-password');

		if (!updatedGroup) return res.status(404).send({ message: 'Group Not Found.' });

		res.status(200).send({ data: updatedGroup });
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong' });
		console.log(error);
	}
};

export const addToGroup = async (req, res) => {
	const { chatId, userId } = req.body;

	// TODO: check if requester is admin or not

	try {
		const addUser = await ChatModel.findByIdAndUpdate(
			chatId,
			{ $push: { user: userId } },
			{ new: true }
		)
			.populate('users', '-password')
			.populate('groupAdmin', '-password');

		if (!addUser) return res.status(404).send({ message: 'Group Not Found.' });

		res.status(200).send({ data: addUser });
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong' });
		console.log(error);
	}
};

export const removeFromGroup = async (req, res) => {
	const { chatId, userId } = req.body;

	// TODO: check if requester is admin or not

	try {
		const removeUser = await ChatModel.findByIdAndUpdate(
			chatId,
			{ $pull: { user: userId } },
			{ new: true }
		)
			.populate('users', '-password')
			.populate('groupAdmin', '-password');

		if (!removeUser) return res.status(404).send({ message: 'Group Not Found.' });

		res.status(200).send({ data: removeUser });
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong' });
		console.log(error);
	}
};
