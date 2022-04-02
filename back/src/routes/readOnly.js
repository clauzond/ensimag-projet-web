import express from 'express';
import { story } from '../controllers/histoire.js';

const router = express.Router();

router.get('/api/readOnly/histoire', story.getStories);

export default router;
