import express from 'express';
import { login } from '../controllers/login.js';

const router = express.Router();
router.post('/api/register', login.registerUser);
router.post('/api/login', login.loginUser);

export default router;
