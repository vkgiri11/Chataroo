import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';

import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

import { errorHandler, notFound } from './middleware/errorMiddleWare.js';

const app = express();
dotenv.config();

connectDB();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
	console.log(`Server Running on Port: http://localhost:${PORT}`)
);

const io = new Server(server, {
	pingTimeout: 600000,
	cors: {
		origin: process.env.CLIENT_URL,
	},
});

io.on('connection', (socket) => {
	console.log('\x1b[35m', 'Connected to socket.io !!');

	socket.on('setup', (id) => {
		socket.join(id);
		socket.emit('connected');
	});

	socket.on('join_chat', (room) => {
		socket.join(room);
		console.log('User Joined Room: ' + room);
	});

	socket.on('new_message', (newMessage) => {
		const chat = newMessage.chat;

		// chat.users -> all the recipients of the message
		if (!chat.users) return console.log('No Recievers Defined !!');

		chat.users.forEach((item) => {
			// socket io will emit to all, including yourself.
			// don't emit message to self
			if (item._id === newMessage.sender._id) return;

			socket.in(item._id).emit('message_recieved', newMessage);
		});
	});
});
