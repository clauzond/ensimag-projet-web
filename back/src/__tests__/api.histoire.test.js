import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
import { getToken } from './util/setupDb.js';

describe('POST /api/histoire', () => {
	test('Test of story creation', async () => {
		const token = await getToken();
		console.log(token);
	});
});
