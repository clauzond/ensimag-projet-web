import express from 'express';
import { story } from '../controllers/histoire.js';

const router = express.Router();
router.post('/api/histoire/', story.createStory);
router.get('/api/histoire/:idHistoire', story.getStory);
router.put('/api/histoire/:idHistoire', story.updateStory);

export default router;
