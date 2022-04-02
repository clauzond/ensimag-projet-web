import express from 'express';
import { story } from '../controllers/histoire.js';
import { paragraphe } from '../controllers/paragraphe.js';

const router = express.Router();

router.get('/api/readOnly/histoire', story.getStories);
router.get(
	'/api/histoire/:idHistoire/paragraphe/:idParagraphe',
	paragraphe.getParagraph
);

export default router;
