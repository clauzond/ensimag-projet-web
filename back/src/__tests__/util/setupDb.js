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

async function createStory(title, username, estPublique, initFirstParagraph) {
	const token =
		username === undefined ? await getToken() : await getToken(username);

	const response = await request(app)
		.post('/api/histoire')
		.set('Content-Type', 'application/json')
		.set('x-access-token', token)
		.send(
			JSON.stringify({
				titre: title,
				estPublique: estPublique === undefined ? false : estPublique
			})
		);

	if (initFirstParagraph !== undefined && initFirstParagraph === true) {
		// Set the content of the init paragraph
		await request(app)
			.put(
				`/api/histoire/${response.body.histoire.idParagrapheInitial}/paragraphe/`
			)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					contenu: 'Ceci est le paragraphe initial de clauzond'
				})
			);
	}

	return response.body.histoire;
}

export { getToken, createStory };
