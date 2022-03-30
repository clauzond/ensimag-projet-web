import { app } from '../app.js';
import request from 'supertest';

describe('POST /api/register', () => {
	test('Test of registration', async () => {
		const username = 'clauzond';

		const response = await request(app)
			.post('/api/register')
			.send({
				data: JSON.stringify({
					username: username,
					password: 'clauzondmdp'
				})
			});
		expect(response.statusCode).toBe(201);
		expect(response.body.message).toBe(`User ${username} was registered`);

		const response2 = await request(app)
			.post('/api/register')
			.send({
				data: JSON.stringify({
					name: 'clauzond',
					email: 'clauzondmdp2'
				})
			});
		expect(response2.statusCode).toBe(304);
	});
});
