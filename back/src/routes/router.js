import express from 'express';
import login from './utilisateur.js';
import story from './histoire.js';
import historique from './historique.js';
import paragraphe from './paragraphe.js';
import { serve, setup } from 'swagger-ui-express';
import swaggerFile from '../../swagger_output.json';
import { auth } from '../util/middleware.js';
import status from 'http-status';
import { RequestError } from '../util/requestError.js';
import readOnly from './readOnly.js';
import { utilisateur } from '../controllers/utilisateur.js';

const router = express.Router();

// Swagger Documentation (before json as it is not json)
router.use('/', serve);
router.get('/', setup(swaggerFile));

// This middleware adds the json header to every response
router.use('/', (req, res, next) => {
	res.type('json');
	next();
});

// No authentification required
router.use(login);
router.use(readOnly);

// Authentification required
router.use(auth);
router.get('/api/whoami', utilisateur.whoami);
router.use(story);
router.use(paragraphe);
router.use(historique);

// Default 404 page
router.use('*', () => {
	throw new RequestError("Page doesn't exist", status.NOT_FOUND);
});

export { router };
