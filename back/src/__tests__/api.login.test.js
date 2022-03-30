import { app } from '../app.js';
import { request } from 'express';

describe('POST /api/register', () => {
	test('Test of registration', async () => {
		await request(app).post('/api/users');

		const username = 'clauzond';

		const response = await request(app)
			.post('/api/users')
			.send({
				data: JSON.stringify({
					username: username,
					password: 'clauzondmdp'
				})
			});
		expect(response.statusCode).toBe(201);
		expect(response.body.message).toBe(`User ${username} was registered`);

		const response2 = await request(app)
			.post('/api/users')
			.send({
				data: JSON.stringify({
					name: 'clauzond',
					email: 'clauzondmdp2'
				})
			});
		expect(response2.statusCode).toBe(304);
	});
});
