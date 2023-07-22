import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
dotenv.config();
connectDB();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('App is running!!');
});

app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`));
