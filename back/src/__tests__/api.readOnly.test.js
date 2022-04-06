import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
import { createStory } from './util/setupDb.js';

describe('GET /api/readOnly/histoire', () => {
	test('Test of get a public story', async () => {
		// Init a story with a valid paragraph (with content and that lead to conclusion)
		const storyTitle = "L'histoire publique de clauzond";
		const firstParagraphContent = 'Ceci est le paragraphe de clauzond';
		const story = await createStory(
			storyTitle,
			true,
			firstParagraphContent
		);

		const response = await request(app).get('/api/readOnly/histoire');
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.stories.length).not.toBe(0);
	});
});
