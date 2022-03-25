import express from 'express';
import story from './histoire.js';
import login from './login.js';
const router = express.Router();

router.use(story);
router.use(login);

export { router };
