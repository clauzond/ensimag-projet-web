import { app } from '../../app.js';
import request from 'supertest';
import status from 'http-status';
const username = 'clauzond';
const password = 'clauzondmdp';

describe('POST /api/register', () => {
	test('Test of unvalid registration', async () => {
		let response;

		response = await request(app)
			.post('/api/register')
			.set('Content-Type', 'application/json')
			.send(
				JSON.stringify({
					name: username,
					password: password
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
					password: password
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
	});

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

	test('Test of double registration', async () => {
		const response = await request(app)
			.post('/api/register')
			.set('Content-Type', 'application/json')
			.send(
				JSON.stringify({
					username: username,
					password: password
				})
			);
		expect(response.statusCode).toBe(status.NOT_MODIFIED);
	});
});

describe('POST /api/login', () => {
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

	test('Test of unvalid utilisateur', async () => {
		const response = await request(app)
			.post('/api/login')
			.set('Content-Type', 'application/json')
			.send(
				JSON.stringify({
					username: username,
					password: 'fakemdp'
				})
			);
		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(`Invalid username or password`);
	});
});
