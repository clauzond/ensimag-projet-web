import express from 'express';
import { story } from '../controllers/histoire.js';
import { paragraphe } from '../controllers/paragraphe.js';

const router = express.Router();

router.get('/api/readOnly/histoire', story.getPublicStories);
router.get('/api/readOnly/histoire/:idHistoire', story.getPublicStory);
router.get(
	'/api/readOnly/histoire/:idHistoire/paragraphe/:idParagraphe',
	paragraphe.getPublicParagraph
);

export default router;
