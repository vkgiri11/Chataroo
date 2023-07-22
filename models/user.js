import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		pic: {
			type: String,
			required: true,
			default: 'https://pixabay.com/vectors/avatar-icon-placeholder-symbol-312603/',
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model('User', userSchema);

export default User;
