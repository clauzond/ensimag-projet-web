import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
import { createStory, createParagraph, getToken } from './util/setupDb.js';
import { history } from '../controllers/historique.js';
import router from '../routes/historique.js';

describe('GET /api/historique/:idHistoire', () => {
	test('Test of getHistory', async () => {
		let response;

		const story = await createStory('1. Test of getHistory');
		const token = await getToken();

		// Modify the user history for this story
		response = await request(app)
			.get(`/api/historique/${story.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send();
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Returning history');
		expect(response.body.history).not.toBe(null);
	});
});

describe('POST /api/historique/:idHistoire', () => {
	test('Test of saveHistory', async () => {
		let response;

		const story = await createStory('Test of saveHistory');
		const paragraph1 = await createParagraph(story);
		const paragraph2 = await createParagraph(story);
		const token = await getToken();

		// Modify the user history for this story
		response = await request(app)
			.post(`/api/historique/${story.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					arrayParagraphe: [paragraph1.id, paragraph2.id]
				})
			);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('History saved');
		expect(response.body.history).not.toBe(null);
		expect(response.body.history.length).toBe(2);
		expect(response.body.history[0]).toBe(paragraph1.id);
		expect(response.body.history[1]).toBe(paragraph2.id);

		// Modify the user history for this story
		response = await request(app)
			.post(`/api/historique/${story.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					arrayParagraphe: [paragraph2.id]
				})
			);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('History saved');
		expect(response.body.history).not.toBe(null);
		expect(response.body.history.length).toBe(1);
		expect(response.body.history[0]).toBe(paragraph2.id);

		// Modify the user history for this story
		response = await request(app)
			.post(`/api/historique/${story.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					arrayParagraphe: []
				})
			);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('History saved');
		expect(response.body.history).not.toBe(null);
		expect(response.body.history.length).toBe(0);
	});
	test('Test of failed saveHistory (no param and wrong param)', async () => {
		let response;

		const story = await createStory(
			'Test of failed saveHistory (no param and wrong param)'
		);
		const paragraph2 = await createParagraph(story);
		const token = await getToken();

		// Modify the user history for this story
		response = await request(app)
			.post(`/api/historique/${story.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(JSON.stringify({}));
		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'You must specify arrayParagraphe param'
		);

		// Modify the user history for this story
		response = await request(app)
			.post(`/api/historique/${story.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					arrayParagraphe: [paragraph2.id, 954789654]
				})
			);
		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'Invalid arrayParagraphe param: one or more id are invalid'
		);
	});
});

describe('DELETE /api/historique/:idHistoire', () => {
	test('Test of clearHistory', async () => {
		let response;

		const story = await createStory('Test of clearHistory');
		const paragraph1 = await createParagraph(story);
		const paragraph2 = await createParagraph(story);
		const token = await getToken();

		// Modify the user history for this story
		response = await request(app)
			.post(`/api/historique/${story.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					arrayParagraphe: [paragraph1.id, paragraph2.id]
				})
			);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('History saved');
		expect(response.body.history).not.toBe(null);
		expect(response.body.history.length).toBe(2);
		expect(response.body.history[0]).toBe(paragraph1.id);
		expect(response.body.history[1]).toBe(paragraph2.id);

		// Clear history
		response = await request(app)
			.delete(`/api/historique/${story.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send();
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('History cleared');
		expect(response.body.history).not.toBe(null);
		expect(response.body.history.length).toBe(0);
	});
});

describe('DELETE /api/historique/:idHistoire/paragraphe/:idParagraphe', () => {
	test('Test of removeHistory for a paragraph', async () => {
		let response;

		const story = await createStory('Test of removeHistory for a paragraph');
		const paragraph1 = await createParagraph(story);
		const paragraph2 = await createParagraph(story,);
		const token = await getToken('clauzondtuconnais');

		// Modify the user history for this story
		response = await request(app)
			.post(`/api/historique/${story.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					arrayParagraphe: [paragraph1.id, paragraph2.id]
				})
			);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('History saved');
		expect(response.body.history).not.toBe(null);
		expect(response.body.history.length).toBe(2);
		expect(response.body.history[0]).toBe(paragraph1.id);
		expect(response.body.history[1]).toBe(paragraph2.id);

		// Remove history
		response = await request(app)
			.delete(`/api/historique/${story.id}/paragraphe/${paragraph1.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send();
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('History removed');
		expect(response.body.history).not.toBe(null);
		expect(response.body.history.length).toBe(1);
		expect(response.body.history[0]).toBe(paragraph2.id);

		// Remove history
		response = await request(app)
			.delete(`/api/historique/${story.id}/paragraphe/${paragraph2.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send();
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('History removed');
		expect(response.body.history).not.toBe(null);
		expect(response.body.history.length).toBe(0);
	});
	test('Test of failed removeHistory for a paragraph (wrong input)', async () => {
		let response;

		const story = await createStory('Test of failed removeHistory for a paragraph (wrong input)');
		const paragraph1 = await createParagraph(story);
		const paragraph2 = await createParagraph(story);
		const token = await getToken();

		// Modify the user history for this story
		response = await request(app)
			.post(`/api/historique/${story.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					arrayParagraphe: [paragraph1.id]
				})
			);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('History saved');
		expect(response.body.history).not.toBe(null);
		expect(response.body.history.length).toBe(1);
		expect(response.body.history[0]).toBe(paragraph1.id);

		// Remove history
		response = await request(app)
			.delete(`/api/historique/${story.id}/paragraphe/${paragraph2.id}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send();
		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe('Paragraph is not in history');
	});
});
