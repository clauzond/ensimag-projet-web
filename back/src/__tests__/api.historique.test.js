import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
import { history } from '../controllers/historique.js';
import router from '../routes/historique.js';

describe('GET /api/historique/:idHistoire', () => {
	test('Test of get history', async () => {
		// TODO
	});
});

describe('POST /api/historique/:idHistoire', () => {
	test('Test of set history', async () => {
		// TODO
	});
});

describe('DELETE /api/historique/:idHistoire', () => {
	test('Test of clear history', async () => {
		// TODO
	});
});

describe('DELETE /api/historique/:idHistoire/paragraphe/:idParagraphe', () => {
	test('Test of remove history for a paragraph', async () => {
		// TODO
	});
});
