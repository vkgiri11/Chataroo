import MessageModel from '../models/messageModel.js';
import UserModel from '../models/userModel.js';

export const sendMessage = async (req, res) => {
	const { content, to_chatId } = req.body;

	if (!content || !to_chatId)
		return res.status(400).send({ message: 'Invalid Parameters recieved.' });

	const newMessage = {
		sender: req.user._id,
		content,
		chat: to_chatId,
	};

	try {
		let message = await MessageModel.create(newMessage);

		message = await message.populate('sender', 'name pic');
		message = await message.populate('chat');
		message = await UserModel.populate(message, {
			path: 'chat.users',
			select: 'name pic email',
		});

		await Chat.findByIdAndUpdate(to_chatId, { latestMessage: message });

		return res.status(200).json({ data: message });
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong' });
		console.log(error);
	}
};

export const getMessagesById = async (req, res) => {
	try {
		const messages = await MessageModel.find({ chat: req.params.chatId })
			.populate('sender', 'name pic email')
			.populate('chat');

		return res.status(200).json({ data: messages });
	} catch (error) {
		res.status(500).json({ message: 'Something went wrong' });
		console.log(error);
	}
};
