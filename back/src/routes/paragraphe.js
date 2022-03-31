import express from 'express';
import { paragraphe } from '../controllers/paragraphe.js';

const router = express.Router();
router.post('/api/histoire/:id/paragraphe/', paragraphe.createParagraphe);
router.get('/api/histoire/:id/paragraphe/:id', paragraphe.getParagraphe);
router.put('/api/histoire/:id/paragraphe/:id', paragraphe.updateParagraphe);
router.delete('/api/histoire/:id/paragraphe/:id', paragraphe.deleteParagraphe);

export default router;
