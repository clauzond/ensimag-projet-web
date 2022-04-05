import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
import { getToken } from './util/setupDb.js';

describe('POST /api/histoire', () => {
	test('Test of failed story creation', async () => {
		const token = await getToken();

		const response = await request(app)
			.post('/api/histoire')
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					title: 'Histoire de clauzond'
				})
			);

		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe('Title not found');
	});

	test('Test of story creation', async () => {
		const token = await getToken();

		const response = await request(app)
			.post('/api/histoire')
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titre: 'Histoire de clauzond'
				})
			);

		expect(response.statusCode).toBe(status.CREATED);
		expect(response.body.message).toBe(
			'Story created! Returning story and initial paragraph'
		);
	});
});

describe('GET /api/histoire/:idHistoire', () => {
	test('Test of get story without specify id', async () => {
		const token = await getToken();

		const response = await request(app)
			.get('/api/histoire')
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.NOT_FOUND);
	});

	test('Test of get unknown story', async () => {
		const token = await getToken();

		const response = await request(app)
			.get('/api/histoire/15')
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.NOT_FOUND);
		expect(response.body.message).toBe("The story doesn't exist");
	});

	test('Test of get existing story', async () => {
		const token = await getToken();

		const response = await request(app)
			.get('/api/histoire/1')
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Returning story');
	});
});
