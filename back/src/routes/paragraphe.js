import express from 'express';
import { paragraphe } from '../controllers/paragraphe.js';

const router = express.Router();
router.post(
	'/api/histoire/:idHistoire/paragraphe/',
	paragraphe.createParagraphe
);
router.get(
	'/api/histoire/:idHistoire/paragraphe/:idParagraphe',
	paragraphe.getParagraphe
);
router.put(
	'/api/histoire/:idHistoire/paragraphe/:idParagraphe',
	paragraphe.updateParagraphe
);
router.delete(
	'/api/histoire/:idHistoire/paragraphe/:idParagraphe',
	paragraphe.deleteParagraphe
);

export default router;
