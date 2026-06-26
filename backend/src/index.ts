import express, { Application, Request, Response } from 'express';


const app: Application = express();
const PORT: number = 5000;

app.use(express.json());


app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Server is running!'});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});