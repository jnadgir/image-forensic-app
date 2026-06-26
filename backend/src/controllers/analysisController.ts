import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Analysis, { IAnalysis } from '../models/Analysis';

// helper function — generates a human readable verdict based on the score
const getVerdict = (score: number): string => {
    if (score >= 0.8) return 'AI Generated';
    if (score >= 0.5) return 'Likely AI Generated';
    if (score >= 0.3) return 'Likely Real';
    return 'Real';
};

export const analyzeImage = async (req: Request, res: Response): Promise<void> => {
    try {
        // check if a file was uploaded
        if (!req.file) {
            res.status(400).json({ message: 'No image file provided' });
            return;
        }

        const file = req.file;
        const filePath = file.path;
        const fileName = file.originalname;

        // build form data for Sightengine
        const formData = new FormData();
        formData.append('media', fs.createReadStream(filePath));
        formData.append('models', 'genai');
        formData.append('api_user', process.env.SIGHTENGINE_API_USER as string);
        formData.append('api_secret', process.env.SIGHTENGINE_API_SECRET as string);

        // call Sightengine API
        const sightengineResponse = await axios.post(
            'https://api.sightengine.com/1.0/check.json',
            formData,
            { headers: formData.getHeaders() }
        );

        // extract AI score
        const aiScore: number = sightengineResponse.data.type?.ai_generated ?? 0;
        const isAiGenerated: boolean = aiScore >= 0.5;
        const verdict: string = getVerdict(aiScore);

        // explicitly cast userId to ObjectId to satisfy TypeScript
       const userId = new mongoose.Types.ObjectId(req.user?._id as unknown as string);

        // save to MongoDB
        const analysis = new Analysis({
            userId,
            imageName: fileName,
            imageUrl: filePath,
            isAiGenerated,
            aiScore,
            verdict,
        });

        await analysis.save();

        // send result to frontend
        res.status(200).json({
            message: 'Image analyzed successfully',
            result: {
                id: analysis._id,
                imageName: analysis.imageName,
                imageUrl: analysis.imageUrl,
                isAiGenerated: analysis.isAiGenerated,
                aiScore: analysis.aiScore,
                verdict: analysis.verdict,
                createdAt: analysis.createdAt,
            },
        });

    } catch (error: any) {
        console.error('Analysis error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Image analysis failed', error: error.message });
    }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        // explicitly cast userId to ObjectId
       const userId = new mongoose.Types.ObjectId(req.user?._id as unknown as string);

        const analyses = await Analysis.find({ userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'History fetched successfully',
            results: analyses,
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch history', error: error.message });
    }
};