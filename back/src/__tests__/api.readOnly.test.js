import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
import { createStory } from './util/setupDb.js';

describe('GET /api/readOnly/histoire', () => {
	test('Test of get a public story', async () => {
		// Init a public story with a valid paragraph (with content and that lead to conclusion)
		const username = 'clauzond';
		const storyTitle = "L'histoire publique de clauzond";
		const firstParagraphContent = 'Ceci est le paragraphe de clauzond';
		await createStory(
			storyTitle,
			username,
			true,
			firstParagraphContent,
			true
		);

		const response = await request(app).get('/api/readOnly/histoire');
		expect(response.statusCode).toBe(status.OK);
		const publicStoriesNb = response.body.stories.length;
		expect(publicStoriesNb).not.toBe(0);

		// Get and check the public story just being import
		const publicStory = response.body.stories[publicStoriesNb - 1];
		expect(publicStory.titre).toBe(storyTitle);
		expect(publicStory.idAuteur).toBe(username);
		expect(publicStory.estPublique).toBe(true);
		expect(publicStory.ParagrapheInitial.contenu).toBe(
			firstParagraphContent
		);
		expect(publicStory.ParagrapheInitial.idRedacteur).toBe(username);
	});

	test('Test of get a private story', async () => {
		// Init a public story with a valid paragraph (with content and that lead to conclusion)
		const username = 'clauzond_private';
		const storyTitle = "L'histoire privée de clauzond";
		const firstParagraphContent =
			'Ceci est le paragraphe de clauzond privé';
		await createStory(
			storyTitle,
			username,
			false,
			firstParagraphContent,
			true
		);

		const response = await request(app).get('/api/readOnly/histoire');
		expect(response.statusCode).toBe(status.OK);
		const publicStoriesNb = response.body.stories.length;

		// Get and check the private story is not in the public stories list
		const publicStory = response.body.stories[publicStoriesNb - 1];
		expect(publicStory.titre).not.toBe(storyTitle);
		expect(publicStory.idAuteur).not.toBe(username);
		expect(publicStory.ParagrapheInitial.contenu).not.toBe(
			firstParagraphContent
		);
		expect(publicStory.ParagrapheInitial.idRedacteur).not.toBe(username);
	});

	test('Test of get a public story that not lead to a conclusion', async () => {
		// Init a public story with a valid paragraph (with content and that lead to conclusion)
		const username = 'clauzond_sans_conclusion';
		const storyTitle = "L'histoire publique de clauzond sans conclusion";
		const firstParagraphContent =
			'Ceci est le paragraphe de clauzond sans conclusion';
		await createStory(
			storyTitle,
			username,
			true,
			firstParagraphContent,
			false
		);

		const response = await request(app).get('/api/readOnly/histoire');
		expect(response.statusCode).toBe(status.OK);
		const publicStoriesNb = response.body.stories.length;

		// Get and check the story is not in the public stories list
		const publicStory = response.body.stories[publicStoriesNb - 1];
		expect(publicStory.titre).not.toBe(storyTitle);
		expect(publicStory.idAuteur).not.toBe(username);
		expect(publicStory.ParagrapheInitial.contenu).not.toBe(
			firstParagraphContent
		);
		expect(publicStory.ParagrapheInitial.idRedacteur).not.toBe(username);
	});

	test('Test of get a public story where the init paragraph is null', async () => {
		// Init a public story with a valid paragraph (with content and that lead to conclusion)
		const username = 'clauzond_sans_paragraphe';
		const storyTitle = "L'histoire publique de clauzond sans paragraphe";
		const firstParagraphContent = null;
		await createStory(
			storyTitle,
			username,
			true,
			firstParagraphContent,
			true
		);

		const response = await request(app).get('/api/readOnly/histoire');
		expect(response.statusCode).toBe(status.OK);
		const publicStoriesNb = response.body.stories.length;

		// Get and check the story is not in the public stories list
		const publicStory = response.body.stories[publicStoriesNb - 1];
		expect(publicStory.titre).not.toBe(storyTitle);
		expect(publicStory.idAuteur).not.toBe(username);
		expect(publicStory.ParagrapheInitial.contenu).not.toBe(
			firstParagraphContent
		);
		expect(publicStory.ParagrapheInitial.idRedacteur).not.toBe(username);
	});
});
