import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';

describe('POST /api/register', () => {
	test('Test of registration', async () => {
		const username = 'clauzond';
		let response;

		response = await request(app)
			.post('/api/register')
			.set('Content-Type', 'application/json')
			.send(
				JSON.stringify({
					name: username,
					password: 'clauzondmdp'
				})
			);
		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'You must specify the username and password'
		);

		response = await request(app)
			.post('/api/register')
			.set('Content-Type', 'application/json')
			.send(
				JSON.stringify({
					username: '',
					password: 'clauzondmdp'
				})
			);
		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'Username or password must not be empty'
		);

		response = await request(app)
			.post('/api/register')
			.set('Content-Type', 'application/json')
			.send(
				JSON.stringify({
					username: username,
					password: '1234'
				})
			);
		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'Password must be at least 6 characters'
		);

		response = await request(app)
			.post('/api/register')
			.set('Content-Type', 'application/json')
			.send(
				JSON.stringify({
					username: username,
					password:
						'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam'
				})
			);
		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'Password must be less than 72 characters'
		);

		response = await request(app)
			.post('/api/register')
			.set('Content-Type', 'application/json')
			.send(
				JSON.stringify({
					username: username,
					password: 'clauzondmdp'
				})
			);
		expect(response.statusCode).toBe(status.CREATED);
		expect(response.body.message).toBe(`User ${username} was registered`);

		let response1 = await request(app)
			.post('/api/register')
			.set('Content-Type', 'application/json')
			.send(
				JSON.stringify({
					username: username,
					password: 'clauzondmdp'
				})
			);
		expect(response1.statusCode).toBe(status.NOT_MODIFIED);
	});
});
