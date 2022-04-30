import express from 'express';
import login from './utilisateur.js';
import story from './histoire.js';
import historique from './historique.js';
import paragraphe from './paragraphe.js';
import { serve, setup } from 'swagger-ui-express';
import { auth } from '../util/middleware.js';
import status from 'http-status';
import { RequestError } from '../util/requestError.js';
import readOnly from './readOnly.js';
import { utilisateur } from '../controllers/utilisateur.js';
import { readFile } from 'fs/promises';
import fs from 'fs';

const SWAGGER_PATH = '../../swagger_output.json';

const router = express.Router();

const swaggerExists = fs.existsSync(new URL(SWAGGER_PATH, import.meta.url));

// Swagger Documentation (before json as it is not json)
let swaggerFile;
if (swaggerExists) {
	swaggerFile = JSON.parse(
		await readFile(new URL(SWAGGER_PATH, import.meta.url))
	);
}
//
router.use('/', serve);

if (swaggerExists) {
	router.get('/',
	// #swagger.ignore = true
	setup(swaggerFile));
}

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
router.get('/api/users', utilisateur.getUsers);
router.use(story);
router.use(paragraphe);
router.use(historique);

// Default 404 page
router.use('*', () => {
	throw new RequestError("Page doesn't exist", status.NOT_FOUND);
});

export { router };
