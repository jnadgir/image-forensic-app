import { Router } from 'express';
import { register, login, getProfile, changePassword, deleteAccount } from '../controllers/authController';
import protect from '../middleware/authMiddleware';

const router: Router = Router();

// Public routes — no token needed
router.post('/register', register);
router.post('/login', login);

// Protected routes — token required
router.get('/profile', protect, getProfile);
router.put('/change-password', protect, changePassword);
router.delete('/delete', protect, deleteAccount);

export default router;