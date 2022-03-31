import express from 'express';
import { paragraphe } from '../controllers/paragraphe.js';

const router = express.Router();
router.post(
	'/api/histoire/:idHistoire/paragraphe/',
	paragraphe.createParagraph
);
router.get(
	'/api/histoire/:idHistoire/paragraphe/:idParagraphe',
	paragraphe.getParagraph
);
router.put(
	'/api/histoire/:idHistoire/paragraphe/:idParagraphe',
	paragraphe.updateParagraph
);
router.delete(
	'/api/histoire/:idHistoire/paragraphe/:idParagraphe',
	paragraphe.deleteParagraph
);

export default router;
