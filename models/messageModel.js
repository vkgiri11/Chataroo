import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
	{
		content: { type: String, trim: true },
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Chat',
		},
	},
	{
		timestamps: true,
	}
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
