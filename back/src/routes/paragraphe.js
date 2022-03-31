import express from 'express';
import { paragraphe } from '../controllers/paragraphe.js';
import { auth } from '../util/middleware.js';

const router = express.Router();
router.get(
	'/api/histoire/:idHistoire/paragraphe/:idParagraphe',
	paragraphe.getParagraph
);
router.use(auth);
router.put(
	'/api/histoire/:idHistoire/paragraphe/:idParagraphe',
	paragraphe.updateParagraph
);
router.put(
	'/api/histoire/:idHistoire/paragraphe/:idParagraphe/cancel-modification',
	paragraphe.cancelModification
);
router.put(
	'/api/histoire/:idHistoire/paragraphe/:idParagraphe/modified',
	paragraphe.askToUpdateParagraph
);
router.post(
	'/api/histoire/:idHistoire/paragraphe/',
	paragraphe.createParagraph
);
// router.delete(
// 	'/api/histoire/:idHistoire/paragraphe/:idParagraphe',
// 	paragraphe.deleteParagraph
// );

export default router;
