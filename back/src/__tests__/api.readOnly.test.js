import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
const username = 'clauzond_login';
const password = 'clauzondmdp_login';

describe('POST /api/register', () => {
	test('Test of valid registration', async () => {
		const response = await request(app)
			.post('/api/register')
			.set('Content-Type', 'application/json')
			.send(
				JSON.stringify({
					username: username,
					password: password
				})
			);
		expect(response.statusCode).toBe(status.CREATED);
		expect(response.body.message).toBe(`User ${username} was registered`);
	});
});
