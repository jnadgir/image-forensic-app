import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Interface — defines the shape of a User document in TypeScript
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// 2. Schema — defines the shape of a User document in MongoDB
const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// 3. Pre-save hook — runs automatically before every .save() call
UserSchema.pre('save', async function () {
    // only hash the password if it was modified (or is new)
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 4. Instance method — available on every User document
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// 5. Model — the actual class you import elsewhere to query the DB
const User = mongoose.model<IUser>('User', UserSchema);

export default User;