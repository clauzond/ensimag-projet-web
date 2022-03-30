import express from 'express';
import login from './login.js';
import story from './histoire.js';
import { auth } from '../middleware.js';

const router = express.Router();

// Login route (no auth required)
router.use(login);

// Require auth past this point
router.use(auth);
router.use(story);

export { router };
