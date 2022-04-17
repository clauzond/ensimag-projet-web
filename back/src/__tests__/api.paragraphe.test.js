import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
import { createStory, getToken } from './util/setupDb.js';
import { ChoixTable, Paragraphe } from '../models/index.js';

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
					idChoix: null,
					estConclusion: true
				})
			);
		expect(response.statusCode).toBe(status.CREATED);
		expect(response.body.message).toBe('Paragraph created');
		expect(response.body.paragraph.id).toBe(story.idParagrapheInitial);
		expect(response.body.choice.estConclusion).toBe(true);
		const choice = await Paragraphe.findByPk(response.body.choice.id);
		expect(choice).not.toBeNull();
		const titreChoix = (
			await ChoixTable.findOne({
				where: { ParagrapheId: story.idParagrapheInitial }
			})
		).titreChoix;
		expect(titreChoix).toBe('Le choix de clauzond');
	});

	test('Test of existing paragraph creation as a choice', async () => {
		let response;

		const story = await createStory(
			'La deuxieme petite histoire de clauzond'
		);
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
		expect(response.body.choice.estConclusion).toBe(false);
		const choice = await ChoixTable.findOne({
			where: { ParagrapheId: story.idParagrapheInitial }
		});
		expect(choice.titreChoix).toBe('Le second choix de clauzond');
		expect(choice.ParagrapheId).toBe(choice.ChoixId);
	});

	test('Test of failed paragraph creation as a choice (idParagraphe does not exist)', async () => {
		let response;

		const story = await createStory(
			'La troisieme petite histoire de clauzond'
		);
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
		expect(response.statusCode).toBe(status.NOT_FOUND);
		expect(response.body.message).toBe(
			'The specified paragraph does not exist'
		);
	});

	test('Test of failed paragraph creation as a choice (idChoix does not exist)', async () => {
		let response;

		const story = await createStory(
			'La quatrieme petite histoire de clauzond'
		);
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
		expect(response.statusCode).toBe(status.NOT_FOUND);
		expect(response.body.message).toBe(
			'The specified choice does not exist'
		);
	});

	test('Test of failed paragraph creation as a choice (choice already exists)', async () => {
		let response;

		const story = await createStory(
			'La cinquieme petite histoire de clauzond'
		);
		const token = await getToken();

		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix: 'Le cinquieme choix de clauzond',
					idParagraphe: story.idParagrapheInitial,
					idChoix: story.idParagrapheInitial
				})
			);
		expect(response.statusCode).toBe(status.CREATED);
		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix: 'Le cinquieme choix de clauzond',
					idParagraphe: story.idParagrapheInitial,
					idChoix: story.idParagrapheInitial
				})
			);
		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe('The choice made already exists');
	});
});

describe('GET /api/histoire/:idHistoire/paragraphe/:idParagraphe', () => {
	test('Test of get paragraph', async () => {
		let response;

		const story = await createStory('1. Test of get paragraph');
		const token = await getToken();

		// Post a new choice (already tested before)
		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix: 'Le premier choix de clauzond',
					idParagraphe: story.idParagrapheInitial,
					idChoix: story.idParagrapheInitial
				})
			);
		expect(response.statusCode).toBe(status.CREATED);
		expect(response.body.message).toBe('Paragraph created');

		// Get the initial paragraph
		response = await request(app)
			.get(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Returning paragraph');
		expect(response.body.story.id).toBe(story.id);
		expect(response.body.paragraph.id).toBe(story.idParagrapheInitial);

		// Verify it has a choice
		expect(response.body.choiceRowArray[0].titreChoix).toBe(
			'Le premier choix de clauzond'
		);
		expect(response.body.choiceRowArray[0].ParagrapheId).toBe(
			story.idParagrapheInitial
		);
		expect(response.body.choiceRowArray[0].ChoixId).toBe(
			story.idParagrapheInitial
		);
	});

	test('Test of failed get paragraph (story does not exist)', async () => {
		let response;

		const story = await createStory(
			'2. Test of failed get paragraph (story does not exist)'
		);
		const token = await getToken();

		response = await request(app)
			.get(
				`/api/histoire/789654789/paragraphe/${story.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.NOT_FOUND);
		expect(response.body.message).toBe("The story doesn't exist");
	});

	test('Test of failed get paragraph (paragraph does not exist)', async () => {
		let response;

		const story = await createStory(
			'3. Test of failed get paragraph (paragraph does not exist)'
		);
		const token = await getToken();

		response = await request(app)
			.get(`/api/histoire/${story.id}/paragraphe/98778998778`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.NOT_FOUND);
		expect(response.body.message).toBe("The paragraph doesn't exist");
	});
});

describe('DELETE /api/histoire/:idHistoire/paragraphe/:idParagraphe', () => {
	test('Test of delete paragraph', async () => {
		let response;

		const story = await createStory('1. Test of delete paragraph');
		const token = await getToken();

		// Create a new paragraph as a choice
		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix: '1. Test of delete paragraph',
					idParagraphe: story.idParagrapheInitial,
					idChoix: null
				})
			);
		expect(response.statusCode).toBe(status.CREATED);
		expect(response.body.message).toBe('Paragraph created');

		const idChoice = response.body.choice.id;
		expect(await Paragraphe.findByPk(idChoice)).not.toBeNull();

		// Delete this paragraph
		response = await request(app)
			.delete(`/api/histoire/${story.id}/paragraphe/${idChoice}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe(
			'Paragraph has been successfully deleted'
		);

		const choiceAfterDeletion = await Paragraphe.findByPk(idChoice);
		expect(choiceAfterDeletion).toBeNull();
		const choiceTableAfterDeletion = await ChoixTable.findOne({
			where: { ParagrapheId: story.idParagrapheInitial }
		});
		expect(choiceTableAfterDeletion).toBeNull();
	});

	test('Test of failed delete paragraph (paragraph is initial)', async () => {
		let response;

		const story = await createStory(
			'2. Test of failed delete paragraph (paragraph is initial)'
		);
		const token = await getToken();

		expect(Paragraphe.findByPk(story.idParagrapheInitial)).not.toBeNull();

		response = await request(app)
			.delete(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'You cannot delete the initial paragraph'
		);
	});

	test('Test of failed delete paragraph (paragraph has choices)', async () => {
		let response;

		const story = await createStory(
			'3. Test of failed delete paragraph (paragraph has choices)'
		);
		const token = await getToken();

		// Create a new paragraph as a choice
		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix:
						'3. Test of failed delete paragraph (paragraph has choices)',
					idParagraphe: story.idParagrapheInitial,
					idChoix: null
				})
			);
		expect(response.statusCode).toBe(status.CREATED);
		expect(response.body.message).toBe('Paragraph created');

		const idChoice1 = response.body.choice.id;
		expect(await Paragraphe.findByPk(idChoice1)).not.toBeNull();

		// Create a choice of this last paragraph created
		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix:
						'3. Test of failed delete paragraph (paragraph has choices)',
					idParagraphe: idChoice1,
					idChoix: null
				})
			);
		expect(response.statusCode).toBe(status.CREATED);
		expect(response.body.message).toBe('Paragraph created');

		const idChoice2 = response.body.choice.id;
		expect(await Paragraphe.findByPk(idChoice2)).not.toBeNull();

		// Delete the first choice
		response = await request(app)
			.delete(`/api/histoire/${story.id}/paragraphe/${idChoice1}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'You cannot delete a paragraph with choices'
		);
	});
});

describe('PUT /api/histoire/:idHistoire/paragraphe/:idParagraphe', () => {
	test('Test of updateParagraph', async () => {
		let response;

		const story = await createStory('1. Test of updateParagraph');
		const token = await getToken();

		// Modify story's initial paragraph
		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					contenu:
						"C'est l'histoire de clauzond qui fait un rap battle"
				})
			);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe(
			'Paragraph has been successfully modified'
		);
		expect(response.body.paragraph.contenu).toBe(
			"C'est l'histoire de clauzond qui fait un rap battle"
		);
		expect(response.body.paragraph.estVerrouille).toBe(false);
	});

	test('Test of failed updateParagraph (no content)', async () => {
		let response;
		const user = 'clauzondParagraphWithoutContent';
		const story = await createStory('1. Test of updateParagraph', user);
		const token = await getToken(user);

		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					contenu: ''
				})
			);
		expect(response.statusCode).toBe(status.NOT_MODIFIED);

		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(JSON.stringify({}));
		expect(response.statusCode).toBe(status.NOT_MODIFIED);

		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					contenu: null
				})
			);
		expect(response.statusCode).toBe(status.NOT_MODIFIED);

		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					contenu:
						'Je teste que les contenus identiques renvoient NOT_MODIFIED'
				})
			);

		expect(response.statusCode).toBe(status.OK);
		expect(response.body.paragraph.contenu).toBe(
			'Je teste que les contenus identiques renvoient NOT_MODIFIED'
		);

		await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}/modified`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);

		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					contenu:
						'Je teste que les contenus identiques renvoient NOT_MODIFIED'
				})
			);
		expect(response.statusCode).toBe(status.NOT_MODIFIED);
	});
});

describe('PUT /api/histoire/:idHistoire/paragraphe/:idParagraphe/modified', () => {
	test('Test of askToUpdateParagraph', async () => {
		let response;

		const username = 'yojesuisunnouvelutilisateur';
		const token = await getToken(username);
		const story = await createStory(
			'1. Test of askToUpdateParagraph',
			username
		);

		// Ask to update story's initial paragraph
		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}/modified`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send();
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Paragraph modification allowed');
		expect(response.body.paragraph.estVerrouille).toBe(true);
		expect(response.body.paragraph.idRedacteur).not.toBe(null);
	});

	test('Test of failed askToUpdateParagraph (user is writing another paragraph)', async () => {
		let response;

		const username = 'yojesuisunnouvelutilisateur';
		const token = await getToken(username);
		const story = await createStory(
			'2. Test of failed askToUpdateParagraph (user is writing another paragraph)',
			username
		);

		// Ask to update story's initial paragraph
		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}/modified`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send();
		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe(
			'You are currently writing another paragraph'
		);
	});

	test('Test of failed askToUpdateParagraph (user is not the redactor)', async () => {
		let response;

		const story = await createStory(
			'3. Test of failed askToUpdateParagraph (user is not the redactor)',
			'HeyJeSuisUnique'
		);

		const token = await getToken('PasLeRedacteur');
		// Ask to update story's initial paragraph
		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}/modified`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send();
		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe(
			'This paragraph is already modified by another user'
		);
	});
});

describe('PUT /api/histoire/:idHistoire/paragraphe/:idParagraphe/cancel-modification', () => {
	test('Test of cancelModification', async () => {
		let response;

		const username = 'HeyMoiCestClauzond';
		const token = await getToken(username);
		const story = await createStory(
			'1. Test of cancelModification',
			username
		);

		// Create a paragraph (cant cancel modification of initial paragraph)
		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix: 'Le choix de clauzond',
					idParagraphe: story.idParagrapheInitial,
					idChoix: null,
					estConclusion: true
				})
			);
		expect(response.statusCode).toBe(status.CREATED);
		let choice = response.body.choice;
		expect(choice.idRedacteur).not.toBe(null);

		// Finish modifying initial paragraph
		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					contenu:
						"C'est l'histoire de clauzond qui fait un rap battle"
				})
			);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.paragraph.estVerrouille).toBe(false);

		// Ask to update the choice created before
		response = await request(app)
			.put(`/api/histoire/${story.id}/paragraphe/${choice.id}/modified`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send();
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Paragraph modification allowed');
		expect(response.body.paragraph.estVerrouille).toBe(true);
		choice = response.body.paragraph;

		// Cancel modification of this paragraph
		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${choice.id}/cancel-modification`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send();
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Modification canceled');
		expect(response.body.paragraph.estVerrouille).toBe(false);
		expect(response.body.paragraph.idRedacteur).toBe(null);
	});
	test('Test of failed cancelModification (user is not writer of the paragraph)', async () => {
		let response;

		const username = 'HeyMoiCestClauzond';
		const token = await getToken(username);
		const story = await createStory(
			'2. Test of failed cancelModification (user is not writer of the paragraph)',
			username
		);

		// Create a paragraph (cant cancel modification of initial paragraph)
		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix: 'Le choix de clauzond',
					idParagraphe: story.idParagrapheInitial,
					idChoix: null,
					estConclusion: true
				})
			);
		expect(response.statusCode).toBe(status.CREATED);
		let choice = response.body.choice;
		expect(choice.idRedacteur).not.toBe(null);

		// Cancel modification of this paragraph
		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${choice.id}/cancel-modification`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', await getToken('PasLeRedacteur'))
			.send();
		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe(
			'You are not allowed to write on this paragraph'
		);
	});
	test('Test of failed cancelModification (on initial paragraph)', async () => {
		let response;

		const username = 'HeyMoiCestClauzond';
		const token = await getToken(username);
		const story = await createStory(
			'3. Test of failed cancelModification (on initial paragraph)',
			username
		);

		// Create a paragraph (cant cancel modification of initial paragraph)
		response = await request(app)
			.post(`/api/histoire/${story.id}/paragraphe/`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titreChoix: 'Le choix de clauzond',
					idParagraphe: story.idParagrapheInitial,
					idChoix: null,
					estConclusion: true
				})
			);
		expect(response.statusCode).toBe(status.CREATED);

		// Cancel modification of the initial paragraph
		response = await request(app)
			.put(
				`/api/histoire/${story.id}/paragraphe/${story.idParagrapheInitial}/cancel-modification`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send();
		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe(
			'You cannot abandon the initial paragraph'
		);
	});
});
