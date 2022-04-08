import express from 'express';
import { history } from '../controllers/historique.js';

const router = express.Router();

router.get('/api/historique/:idHistoire', history.getHistory);
router.post('/api/historique/:idHistoire', history.saveHistory);
router.delete('/api/historique/:idHistoire', history.clearHistory);
router.delete(
	'/api/historique/:idHistoire/paragraphe/:idParagraphe',
	history.removeHistory
);

export default router;
