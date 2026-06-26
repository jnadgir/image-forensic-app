import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';

const generateToken = (id: string): string => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: 'Please provide all fields' });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists with this email' });
            return;
        }

        const user: IUser = await User.create({ name, email, password });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token: generateToken((user._id as mongoose.Types.ObjectId).toString()),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Please provide email and password' });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token: generateToken((user._id as mongoose.Types.ObjectId).toString()),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const Analysis = mongoose.model('Analysis');
        const totalScans = await Analysis.countDocuments({ userId });
        const aiDetected = await Analysis.countDocuments({ userId, isAiGenerated: true });
        const realImages = await Analysis.countDocuments({ userId, isAiGenerated: false });

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: (user as any).createdAt,
            },
            stats: {
                totalScans,
                aiDetected,
                realImages,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching profile', error });
    }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: 'Please provide current and new password' });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            res.status(401).json({ message: 'Current password is incorrect' });
            return;
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error changing password', error });
    }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;

        const Analysis = mongoose.model('Analysis');
        await Analysis.deleteMany({ userId });

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting account', error });
    }
};