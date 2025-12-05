import express from 'express';
import cors from 'cors';
import multer from 'multer';
import Replicate from 'replicate';
import fetch from 'node-fetch';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create directories
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
};

ensureDirectoryExists(path.join(__dirname, 'uploads/temp'));
ensureDirectoryExists(path.join(__dirname, 'uploads/ai-processed'));

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads/temp');
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Images only!'));
    }
});

// Initialize Replicate
let replicate;
try {
    if (!process.env.REPLICATE_API_TOKEN) {
        console.warn('⚠ REPLICATE_API_TOKEN not found in environment variables');
        console.warn('⚠ AI features will not work. Add REPLICATE_API_TOKEN to .env file');
    } else {
        replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });
        console.log('✓ Replicate initialized successfully');
    }
} catch (error) {
    console.error('✗ Failed to initialize Replicate:', error.message);
}

// Initialize Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log('✓ Cloudinary configured');

// ============ ROUTES ============

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend working!',
        timestamp: new Date().toISOString(),
        replicateConfigured: !!process.env.REPLICATE_API_TOKEN
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Style Transfer API (returns base64 for preview)
app.post('/api/ai-style-transfer', upload.single('image'), async (req, res) => {
    console.log('=== AI Style Transfer Request ===');
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('File:', req.file ? 'Present' : 'Missing');
    console.log('Body:', req.body);

    try {
        if (!replicate) {
            console.error('Replicate not configured');
            return res.status(500).json({
                success: false,
                error: 'Replicate API not configured. Please add REPLICATE_API_TOKEN to .env file.'
            });
        }

        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ success: false, error: 'No image uploaded' });
        }

        const { style } = req.body;
        const styles = {
            hollywood: 'hollywood.jpg',
            vaporwave: 'vaporwave.jpg',
            anime: 'anime.jpg',
            sketch: 'sketch.jpg'
        };

        if (!styles[style]) {
            console.error('Invalid style:', style);
            return res.status(400).json({
                success: false,
                error: 'Invalid style. Choose: hollywood, vaporwave, anime, or sketch'
            });
        }

        console.log(`✓ Processing style: ${style}`);

        const imagePath = path.join(__dirname, 'uploads/temp', req.file.filename);

        // Upload to Cloudinary
        console.log('✓ Uploading to Cloudinary...');
        const uploadResult = await cloudinary.uploader.upload(imagePath, {
            folder: 'reorkut-ai-uploads'
        });
        const imageUrl = uploadResult.secure_url;
        console.log(`✓ Uploaded to Cloudinary: ${imageUrl}`);

        // Style image
        const stylePath = path.join(__dirname, 'public', 'ai-profile-styles', styles[style]);

        if (!fs.existsSync(stylePath)) {
            console.error(`Style image not found: ${stylePath}`);
            return res.status(400).json({
                success: false,
                error: `Style image not found: ${styles[style]}. Please ensure style images exist in public/ai-profile-styles/`
            });
        }

        // We can also upload style image to Cloudinary if needed, but Replicate might accept base64 for style or we can use public URL if we host it. 
        // For now, let's keep style as base64 or upload it too if needed. 
        // Actually, mixing URL and base64 works fine usually.
        const styleBuffer = fs.readFileSync(stylePath);
        const styleBase64 = `data:image/jpeg;base64,${styleBuffer.toString('base64')}`;

        console.log('✓ Calling Replicate API...');

        // Replicate call
        const output = await replicate.run(
            "philz1337x/style-transfer:a15407d73d9669676d623e37ee3b6d43642439beec1b99639967d215bcf42fc4",
            {
                input: {
                    image: imageUrl, // Pass Cloudinary URL
                    image_style: styleBase64,
                    width: 512,
                    height: 512,
                    negative_prompt: "worst quality, low quality, normal quality",
                }
            }
        );

        console.log('✓ Replicate response received');

        const aiImageUrl = output[0].url();
        const img = await fetch(aiImageUrl);
        const arrayBuffer = await img.arrayBuffer();
        const buf = Buffer.from(arrayBuffer);

        // Clean up temp file
        fs.unlinkSync(imagePath);

        console.log('✓ AI processing complete');

        res.json({
            success: true,
            imageUrl: `data:image/webp;base64,${buf.toString('base64')}`
        });

    } catch (error) {
        console.error('❌ AI Style Transfer Error:', error);

        // Clean up temp file on error
        if (req.file) {
            const imagePath = path.join(__dirname, 'uploads/temp', req.file.filename);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Style Transfer with Save (saves to server and returns URL)
app.post('/api/ai-style-transfer-save', upload.single('image'), async (req, res) => {
    console.log('=== AI Style Transfer + Save Request ===');

    try {
        if (!replicate) {
            return res.status(500).json({
                success: false,
                error: 'Replicate API not configured. Please add REPLICATE_API_TOKEN to .env file.'
            });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image uploaded' });
        }

        const { style, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, error: 'userId required' });
        }

        const styles = {
            hollywood: 'hollywood.jpg',
            vaporwave: 'vaporwave.jpg',
            anime: 'anime.jpg',
            sketch: 'sketch.jpg'
        };

        if (!styles[style]) {
            return res.status(400).json({
                success: false,
                error: 'Invalid style'
            });
        }

        console.log(`✓ Processing style: ${style} for user: ${userId}`);

        const imagePath = path.join(__dirname, 'uploads/temp', req.file.filename);
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

        // Style image
        const stylePath = path.join(__dirname, 'public', 'ai-profile-styles', styles[style]);

        if (!fs.existsSync(stylePath)) {
            return res.status(400).json({
                success: false,
                error: `Style image not found. Please ensure style images exist in public/ai-profile-styles/`
            });
        }

        const styleBuffer = fs.readFileSync(stylePath);
        const styleBase64 = `data:image/jpeg;base64,${styleBuffer.toString('base64')}`;

        console.log('✓ Calling Replicate API...');

        // Replicate call
        const output = await replicate.run(
            "fofr/style-transfer:f1023890703bc0a5a3a2c21b5e498833be5f6ef6e70e9daf6b9b3a4fd8309cf0",
            {
                input: {
                    content_image: base64Image,
                    style_image: styleBase64,
                    width: 512,
                    height: 512
                }
            }
        );

        console.log('✓ Replicate response received');

        const aiImageUrl = output[0].url();
        const img = await fetch(aiImageUrl);
        const buf = await img.buffer();

        // Save processed image
        const savedFileName = `${userId}-${style}-${Date.now()}.webp`;
        const savePath = path.join(__dirname, 'uploads/ai-processed', savedFileName);
        fs.writeFileSync(savePath, buf);

        // Clean up temp file
        fs.unlinkSync(imagePath);

        const serverImageUrl = `/uploads/ai-processed/${savedFileName}`;

        console.log('✓ AI processing complete, image saved:', serverImageUrl);

        res.json({
            success: true,
            imageUrl: serverImageUrl,
            filename: savedFileName
        });

    } catch (error) {
        console.error('❌ AI Style Transfer + Save Error:', error);

        // Clean up temp file on error
        if (req.file) {
            const imagePath = path.join(__dirname, 'uploads/temp', req.file.filename);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ CORS enabled for http://localhost:5173`);
    console.log(`✓ Replicate configured: ${!!process.env.REPLICATE_API_TOKEN}`);
    if (!process.env.REPLICATE_API_TOKEN) {
        console.log('⚠ Add REPLICATE_API_TOKEN to .env to enable AI features');
    }
    console.log('=================================');
});