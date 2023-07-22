import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
dotenv.config();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('App is Running !!');
});

app.get('/chats', (req, res) => {
	res.send('App is Running !!');
});

app.get('/chats/:id', (req, res) => {
	res.send(`App running on ${PORT}!!`);
});

app.listen(PORT, () => console.log('Server Running!!'));
