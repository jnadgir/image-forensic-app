import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser } from '../models/User';

// 1. Extend Express's Request type to include a 'user' field
// By default, req.user doesn't exist in Express — we add it here
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

// 2. Interface for the JWT payload — what we stored inside the token
interface JwtPayload {
    id: string;
}

// 3. The middleware function itself
const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token: string | undefined;

        // tokens are sent in the Authorization header as: "Bearer <token>"
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; // extract just the token part
        }

        // if no token found, block the request
        if (!token) {
            res.status(401).json({ message: 'Not authorized, no token provided' });
            return;
        }

        // verify the token using our secret key
        // if the token is invalid or expired, jwt.verify() throws an error
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        // find the user from the ID stored in the token
        // we exclude the password field since we don't need it here
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({ message: 'Not authorized, user not found' });
            return;
        }

        // attach the user to the request object
        // now any route that uses this middleware can access req.user
        req.user = user;

        // call next() to pass control to the actual route handler
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
};

export default protect;