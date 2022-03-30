import express from 'express';
import login from './login.js';
import story from './histoire.js';
import { auth } from '../util/middleware.js';
import { serve, setup } from 'swagger-ui-express';
import swaggerFile from '../../swagger_output.json';

const router = express.Router();

// Swagger Documentation
router.use('/', serve);
router.get('/', setup(swaggerFile));

// Login route (no auth required)
router.use(login);

// Require auth past this point
router.use(auth);
router.use(story);

export { router };
