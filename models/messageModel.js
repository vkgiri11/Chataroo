import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
	{
		content: { type: String, trim: true },
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserModel',
		},
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'ChatModel',
		},
	},
	{
		timestamps: true,
	}
);

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
