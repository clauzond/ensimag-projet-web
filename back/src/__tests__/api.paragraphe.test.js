import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
import { paragraphe } from '../controllers/paragraphe.js';
import { createStory, getToken } from './util/setupDb.js';
import { ChoixTable, Paragraphe } from '../models/index.js';
const username = 'clauzond';
const password = 'clauzondmdp';

describe('POST /api/histoire/:idHistoire/paragraphe/', () => {
	test('Test of new paragraph creation as a choice', async () => {
		let response;

		const story = await createStory('La petite histoire de clauzond');
		const token = await getToken();

		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix: 'Le choix de clauzond',
					idParagraphe: story.idParagrapheInitial,
					idChoix: null
				})
			);
		expect(response.statusCode).toBe(status.CREATED);
		expect(response.body.message).toBe('Paragraph created');
		expect(response.body.paragraph.id).toBe(story.idParagrapheInitial);
		const choice = await ChoixTable.findOne({
			where: { ParagrapheId: story.idParagrapheInitial }
		});
		expect(choice.titreChoix).toBe('Le choix de clauzond');
	});

	test('Test of existing paragraph creation as a choice', async () => {
        let response;

		const story = await createStory('La deuxieme petite histoire de clauzond');
		const token = await getToken();

		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix: 'Le second choix de clauzond',
					idParagraphe: story.idParagrapheInitial,
					idChoix: story.idParagrapheInitial
				})
			);
		expect(response.statusCode).toBe(status.CREATED);
		expect(response.body.message).toBe('Paragraph created');
		expect(response.body.paragraph.id).toBe(story.idParagrapheInitial);
		const choice = await ChoixTable.findOne({
			where: { ParagrapheId: story.idParagrapheInitial }
		});
		expect(choice.titreChoix).toBe('Le second choix de clauzond');
        expect(choice.ParagrapheId).toBe(choice.ChoixId);
    });

	test('Test of failed paragraph creation as a choice (idParagraphe does not exist)', async () => {
        let response;

		const story = await createStory('La troisieme petite histoire de clauzond');
		const token = await getToken();

		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix: 'Le troisieme choix de clauzond',
					idParagraphe: 99999,
					idChoix: null
				})
			);
		expect(response.statusCode).toBe(status.BAD_REQUEST);
        expect(response.body.message).toBe('The specified paragraph does not exist');
    });

	test('Test of failed paragraph creation as a choice (idChoix does not exist)', async () => {
        let response;

		const story = await createStory('La quatrieme petite histoire de clauzond');
		const token = await getToken();

		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix: 'Le quatrieme choix de clauzond',
					idParagraphe: story.idParagrapheInitial,
					idChoix: 9999
				})
			);
		expect(response.statusCode).toBe(status.BAD_REQUEST);
        expect(response.body.message).toBe('The specified choice does not exist');
    });

	test('Test of failed paragraph creation as a choice (choice already exists)', async () => {});
});

describe('GET /api/histoire/:idHistoire/paragraphe/:idParagraphe', () => {
	test('Test of get paragraph', async () => {
		// TODO: test paragraphe.getParagraph
	});
});

describe('DELETE /api/histoire/:idHistoire/paragraphe/:idParagraphe', () => {
	test('Test of delete paragraph', async () => {
		// TODO: test paragraphe.deleteParagraph
	});
	test('Test of failed delete paragraph (paragraph has choices)', async () => {
		// TODO: test paragraphe.deleteParagraph
	});
});

describe('PUT /api/histoire/:idHistoire/paragraphe/:idParagraphe/modified', () => {
	test('Test of valid utilisateur', async () => {
		// TODO: test paragraphe.askToUpdateParagraph
	});
});

describe('PUT /api/histoire/:idHistoire/paragraphe/:idParagraphe/modified', () => {
	test('Test of valid utilisateur', async () => {
		// TODO: test paragraphe.cancelModification
	});
});

describe('PUT /api/histoire/:idHistoire/paragraphe/:idParagraphe', () => {
	test('Test of valid utilisateur', async () => {
		// TODO: test paragraphe.updateParagraph
	});
});
