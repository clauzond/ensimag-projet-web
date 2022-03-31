import express from 'express';
import { story } from '../controllers/histoire.js';
import { auth } from '../util/middleware.js';

const router = express.Router();

router.get('/api/histoire/:idHistoire', story.getStory);
router.use(auth);
router.post('/api/histoire/', story.createStory);
router.put('/api/histoire/:idHistoire', story.updateStory);

export default router;
