import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
const username = 'clauzond';
const password = 'clauzondmdp';

describe('POST /api/histoire', () => {
	test('Test of valid utilisateur', async () => {
		const response = await request(app)
			.post('/api/login')
			.set('Content-Type', 'application/json')
			.send(
				JSON.stringify({
					username: username,
					password: password
				})
			);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Returning token');
	});
});
