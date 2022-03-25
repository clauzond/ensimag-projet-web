import express from 'express';
import { story } from '../controllers/histoire.js';

const router = express.Router();
router.get('/api/histoire/:id', story.getStoryById);

export default router;
