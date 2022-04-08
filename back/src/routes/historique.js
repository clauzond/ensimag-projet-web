import express from 'express';
import { history } from '../controllers/historique.js';

const router = express.Router();

router.get('/api/historique/', history.getHistory);
router.post('/api/historique/', history.saveHistory);

export default router;
