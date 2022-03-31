import express from 'express';
import { utilisateur } from '../controllers/utilisateur.js';

const router = express.Router();
router.post('/api/register', utilisateur.registerUser);
router.post('/api/utilisateur', utilisateur.loginUser);

export default router;
