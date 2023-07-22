import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import {chats} from './utils/sample_data.js';

const app = express();
dotenv.config();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Server Running');
});

app.get('/api/chats', (req, res) => {
	res.send(chats);
});

app.get('/api/chats/:id', (req, res) => {
	const req_chat = chats.filter((item) => item._id === req.params.id);
	res.send(req_chat);
});

app.listen(PORT, () => console.log('Server Running!!!'));
