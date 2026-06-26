import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import analysisRoutes from './routes/analysisRoutes';

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

// middleware
app.use(cors());
app.use(express.json());

// serve uploads folder as static files
// this means http://localhost:5000/uploads/filename.jpg will work
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// connect to MongoDB
connectDB();

// routes
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);

// health check
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Server is running!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});