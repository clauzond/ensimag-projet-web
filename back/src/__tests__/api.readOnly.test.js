import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
import { createStory, getToken } from './util/setupDb.js';

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
		const privateStory = response.body.stories[publicStoriesNb - 1];
		expect(privateStory.titre).not.toBe(storyTitle);
		expect(privateStory.idAuteur).not.toBe(username);
		expect(privateStory.ParagrapheInitial.contenu).not.toBe(
			firstParagraphContent
		);
		expect(privateStory.ParagrapheInitial.idRedacteur).not.toBe(username);
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

describe('GET /api/readOnly/histoire/:idHistoire', () => {
	test('Test of get a unique public story', async () => {
		// Init a public story with a valid paragraph (with content and that lead to conclusion)
		const username = 'clauzond';
		const storyTitle = "L'histoire publique et unique de clauzond";
		const firstParagraphContent = 'Ceci est le paragraphe de clauzond';
		const newStory = await createStory(
			storyTitle,
			username,
			true,
			firstParagraphContent,
			true
		);

		const response = await request(app).get(
			`/api/readOnly/histoire/${newStory.id}`
		);
		expect(response.statusCode).toBe(status.OK);

		// Get and check the public story just being import
		const publicStory = response.body.story;
		expect(publicStory.id).toBe(newStory.id);
		expect(publicStory.titre).toBe(storyTitle);
		expect(publicStory.idAuteur).toBe(username);
		expect(publicStory.estPublique).toBe(true);
	});

	test('Test of get a unique private story', async () => {
		// Init a public story with a valid paragraph (with content and that lead to conclusion)
		const username = 'clauzond_private';
		const storyTitle = "L'histoire privée et unique de clauzond";
		const firstParagraphContent =
			'Ceci est le paragraphe de clauzond privé';
		const newStory = await createStory(
			storyTitle,
			username,
			false,
			firstParagraphContent,
			true
		);

		const response = await request(app).get(
			`/api/readOnly/histoire/${newStory.id}`
		);
		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe('This story is private');
	});

	test('Test of get a unique public story that not lead to a conclusion', async () => {
		// Init a public story with a valid paragraph (with content and that lead to conclusion)
		const username = 'clauzond_sans_conclusion';
		const storyTitle = "L'histoire publique de clauzond sans conclusion";
		const firstParagraphContent =
			'Ceci est le paragraphe de clauzond sans conclusion';
		const newStory = await createStory(
			storyTitle,
			username,
			true,
			firstParagraphContent,
			false
		);

		const response = await request(app).get(
			`/api/readOnly/histoire/${newStory.id}`
		);
		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe('This story is private');
	});

	test('Test of get a unique public story where the init paragraph is null', async () => {
		// Init a public story with a valid paragraph (with content and that lead to conclusion)
		const username = 'clauzond_sans_paragraphe';
		const storyTitle = "L'histoire publique de clauzond sans paragraphe";
		const firstParagraphContent = null;
		const newStory = await createStory(
			storyTitle,
			username,
			true,
			firstParagraphContent,
			true
		);

		const response = await request(app).get(
			`/api/readOnly/histoire/${newStory.id}`
		);
		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe('This story is private');
	});
});

describe('GET /api/readOnly/histoire/:idHistoire/paragraphe/:idParagraphe', () => {
	test('Test of get a paragraph from a private story', async () => {
		const story = await createStory(
			'1. Test of get a paragraph from private story'
		);
		const token = await getToken();

		// Get the initial paragraph
		const response = await request(app)
			.get(
				`/api/readOnly/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe('This story is private');
	});

	test('Test of get a locked paragraph from a public story', async () => {
		const user = 'userWithLockedParagraph';
		const story = await createStory(
			'2. Test of get a paragraph from private story',
			user,
			true,
			'Contenu du paragraphe initial',
			true
		);
		const token = await getToken(user);

		// Set final paragraph locked
		const lockedParagraph = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${
					story.idParagrapheInitial + 1
				}/modified`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);

		console.log(lockedParagraph.body.paragraph);

		// Get the final paragraph
		const response = await request(app)
			.get(
				`/api/readOnly/histoire/${story.id}/paragraphe/${
					story.idParagrapheInitial + 1
				}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe('This paragraph is locked');
	});

	test('Test of get a paragraph from a public story', async () => {
		const firstParagraphContent = 'Contenu du paragraphe public';
		const story = await createStory(
			'3. Test of get a paragraph from private story',
			undefined,
			true,
			firstParagraphContent,
			true
		);
		const token = await getToken();

		// Get the initial paragraph
		const response = await request(app)
			.get(
				`/api/readOnly/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Returning paragraph');
		expect(response.body.story.id).toBe(story.id);
		expect(response.body.paragraph.id).toBe(story.idParagrapheInitial);
	});
});

// TODO
// describe('GET /api/readOnly/histoire/:idHistoire', () => {
// });
