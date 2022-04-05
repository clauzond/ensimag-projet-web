import request from 'supertest';
import { app } from '../../app.js';

const username = 'clauzond';
const password = 'clauzondmdp';

async function userRegistration() {
	await request(app)
		.post('/api/register')
		.set('Content-Type', 'application/json')
		.send(
			JSON.stringify({
				username: username,
				password: password
			})
		);
}

async function getToken() {
	await userRegistration();

	const response = await request(app)
		.post('/api/login')
		.set('Content-Type', 'application/json')
		.send(
			JSON.stringify({
				username: username,
				password: password
			})
		);

	return response.body.data;
}

async function createStory(title) {
	const token = await getToken();

	const response = await request(app)
		.post('/api/histoire')
		.set('Content-Type', 'application/json')
		.set('x-access-token', token)
		.send(
			JSON.stringify({
				titre: title
			})
		);

	return response.body.histoire;
}

export { getToken, createStory };
