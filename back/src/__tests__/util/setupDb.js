import request from 'supertest';
import { app } from '../../app.js';

const USERNAME = 'clauzond';
const PASSWORD = 'clauzondmdp';

async function userRegistration(username, password) {
	await request(app)
		.post('/api/register')
		.set('Content-Type', 'application/json')
		.send(
			JSON.stringify({
				username: username === undefined ? USERNAME : username,
				password: password === undefined ? PASSWORD : password
			})
		);
}

/**
 * Return the token of the created user.
 * @param username This parameter is optional
 * @returns {Promise<*>}
 */
async function getToken(username, password) {
	await userRegistration(username, password);

	const response = await request(app)
		.post('/api/login')
		.set('Content-Type', 'application/json')
		.send(
			JSON.stringify({
				username: username === undefined ? USERNAME : username,
				password: password === undefined ? PASSWORD : password
			})
		);

	return response.body.data;
}

async function createStory(
	title,
	username,
	isPublic,
	firstParagraphContent,
	leadToConlusion,
	password
) {
	const token =
		username === undefined
			? await getToken()
			: await getToken(username, password);

	const response = await request(app)
		.post('/api/histoire')
		.set('Content-Type', 'application/json')
		.set('x-access-token', token)
		.send(
			JSON.stringify({
				titre: title,
				estPublique: isPublic === undefined ? false : isPublic
			})
		);

	if (firstParagraphContent !== undefined) {
		// Set the content of the init paragraph
		await request(app)
			.put(
				`/api/histoire/${response.body.histoire.id}/paragraphe/${response.body.histoire.idParagrapheInitial}`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					contenu: firstParagraphContent
				})
			);

		if (leadToConlusion !== undefined && leadToConlusion === true) {
			await request(app)
				.post(`/api/histoire/${response.body.histoire.id}/paragraphe/`)
				.set('Content-Type', 'application/json')
				.set('x-access-token', token)
				.send(
					JSON.stringify({
						titreChoix: 'Le choix final de clauzond',
						idParagraphe:
							response.body.histoire.idParagrapheInitial,
						idChoix: null,
						estConclusion: true
					})
				);
		}
	}

	return response.body.histoire;
}

async function createParagraph(
	story,
	title,
	username,
	idParagraphe,
	idChoix,
	estConclusion,
	condition,
	password
) {
	title = title == undefined ? '' : title;
	const token =
		username == undefined ? await getToken() : await getToken(username, password);
	estConclusion = estConclusion == undefined ? false : estConclusion;
	idParagraphe =
		idParagraphe == undefined ? story.idParagrapheInitial : idParagraphe;
	idChoix = idChoix == undefined ? null : idChoix;
	condition = condition == undefined ? null : condition;

	const response = await request(app)
		.post(`/api/histoire/${story.id}/paragraphe/`)
		.set('Content-Type', 'application/json')
		.set('x-access-token', token)
		.send(
			JSON.stringify({
				titreChoix: title,
				idParagraphe: idParagraphe,
				idChoix: idChoix,
				estConclusion: estConclusion,
				condition: condition
			})
		);
	return response.body.choice;
}

async function updateParagraph(story, idParagraphe, contenu, username, password) {
	const token =
		username == undefined ? await getToken() : await getToken(username, password);

	// Ask to update paragraph
	await request(app)
		.put(`/api/histoire/${story.id}/paragraphe/${idParagraphe}/modified`)
		.set('Content-Type', 'application/json')
		.set('x-access-token', token)
		.send();

	// Modify paragraph content
	const response = await request(app)
		.put(`/api/histoire/${story.id}/paragraphe/${idParagraphe}`)
		.set('Content-Type', 'application/json')
		.set('x-access-token', token)
		.send(
			JSON.stringify({
				contenu: contenu
			})
		);
}

export { getToken, createStory, createParagraph, updateParagraph };
