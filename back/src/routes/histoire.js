import express from 'express';
const router = express.Router();

const story = import('../controllers/histoire.js');

router.get('/api/histoire/:id', story.getStoryById);

export { router };
