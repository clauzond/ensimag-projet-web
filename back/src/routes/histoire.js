import express from 'express';
import { story } from '../controllers/histoire.js';

const router = express.Router();
router.post('/api/histoire/', story.createStory);
router.get('/api/histoire/:id', story.getStory);
router.put('/api/histoire/:id', story.updateStory);

export default router;
