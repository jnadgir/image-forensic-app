import mongoose, { Document, Schema } from 'mongoose';

// 1. Interface — defines the shape of an Analysis document in TypeScript
export interface IAnalysis extends Document {
    userId: mongoose.Types.ObjectId;
    imageName: string;
    imageUrl: string;
    isAiGenerated: boolean;
    aiScore: number;
    verdict: string;
    createdAt: Date;
}

// 2. Schema — defines the shape of an Analysis document in MongoDB
const AnalysisSchema = new Schema<IAnalysis>(
    {
        // reference to the User who uploaded this image
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',         // tells Mongoose this links to the User model
            required: true,
        },
        // original filename of the uploaded image
        imageName: {
            type: String,
            required: true,
        },
        // path where the image is stored on the server
        imageUrl: {
            type: String,
            required: true,
        },
        // true if AI generated, false if real
        isAiGenerated: {
            type: Boolean,
            required: true,
        },
        // Sightengine's AI probability score — a number between 0 and 1
        // 0 = definitely real, 1 = definitely AI generated
        aiScore: {
            type: Number,
            required: true,
        },
        // human readable verdict string — e.g. "AI Generated" or "Likely Real"
        verdict: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Analysis = mongoose.model<IAnalysis>('Analysis', AnalysisSchema);

export default Analysis;