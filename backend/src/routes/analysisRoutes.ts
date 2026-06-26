import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { analyzeImage, getHistory } from '../controllers/analysisController';
import protect from '../middleware/authMiddleware';

// 1. configure multer storage — where and how to save uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // save files to the uploads/ folder
    },
    filename: (req, file, cb) => {
        // give each file a unique name: timestamp + original extension
        // e.g. 1719392000000.jpg
        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

// 2. file filter — only allow image files
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);  // accept the file
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'));
    }
};

// 3. create the multer instance with our config
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
});

const router: Router = Router();

// protect middleware runs first — checks JWT token
// upload.single('image') runs second — processes the uploaded file
// analyzeImage runs last — the actual controller logic
router.post('/analyze', protect, upload.single('image'), analyzeImage);
router.get('/history', protect, getHistory);

export default router;