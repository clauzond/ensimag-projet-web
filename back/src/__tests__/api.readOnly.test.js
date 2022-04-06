import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
import { createStory } from './util/setupDb.js';

describe('GET /api/readOnly/histoire', () => {
	const username = 'clauzond';
	const story = createStory("L'histoire de clauzond", username, true, true);

	test('Test of get a public story', async () => {
		const response = await request(app).get('/api/readOnly/histoire');
		expect(response.statusCode).toBe(status.OK);
	});
});
