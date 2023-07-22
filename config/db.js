import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.CONNECTION_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log(`MongoDB Connected Successfully!!`);
	} catch (error) {
		console.log('Database not connected');
		console.log(`Error ==> ${error.message}`);
		process.exit();
	}
};

export default connectDB;
