import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		pic: {
			type: String,
			default: 'https://pixabay.com/vectors/avatar-icon-placeholder-symbol-312603/',
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function (next) {
	if (!this.isModified) next();

	this.password = bcrypt.hashSync(this.password, 12);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
