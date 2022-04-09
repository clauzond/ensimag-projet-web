import request from 'supertest';
import { app } from '../../app.js';

const USERNAME = 'clauzond';
const PASSWORD = 'clauzondmdp';

async function userRegistration(username) {
	await request(app)
		.post('/api/register')
		.set('Content-Type', 'application/json')
		.send(
			JSON.stringify({
				username: username === undefined ? USERNAME : username,
				password: PASSWORD
			})
		);
}

/**
 * Return the token of the created user.
 * @param username This parameter is optional
 * @returns {Promise<*>}
 */
async function getToken(username) {
	await userRegistration(username);

	const response = await request(app)
		.post('/api/login')
		.set('Content-Type', 'application/json')
		.send(
			JSON.stringify({
				username: username === undefined ? USERNAME : username,
				password: PASSWORD
			})
		);

	return response.body.data;
}

async function createStory(
	title,
	username,
	isPublic,
	firstParagraphContent,
	leadToConlusion
) {
	const token =
		username === undefined ? await getToken() : await getToken(username);

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
	estConclusion
) {
	title = title == undefined ? '' : title;
	const token =
		username == undefined ? await getToken() : await getToken(username);
	estConclusion = estConclusion == undefined ? false : estConclusion;
	idParagraphe =
		idParagraphe == undefined ? story.idParagrapheInitial : idParagraphe;
	idChoix = idChoix == undefined ? null : idChoix;

	const response = await request(app)
		.post(`/api/histoire/${story.id}/paragraphe/`)
		.set('Content-Type', 'application/json')
		.set('x-access-token', token)
		.send(
			JSON.stringify({
				titreChoix: title,
				idParagraphe: idParagraphe,
				idChoix: idChoix,
				estConclusion: estConclusion
			})
		);
	return response.body.choice;
}

export { getToken, createStory, createParagraph };
