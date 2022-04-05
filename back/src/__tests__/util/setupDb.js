import request from 'supertest';
import { app } from '../../app.js';

const username = 'clauzond';
const password = 'clauzondmdp';

async function userRegistration() {
	request(app)
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

export { getToken };
