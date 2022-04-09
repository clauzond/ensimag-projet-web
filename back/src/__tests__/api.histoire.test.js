import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
import { createStory, getToken } from './util/setupDb.js';
let idStory;

describe('POST /api/histoire', () => {
	test('Test of failed story creation', async () => {
		const token = await getToken();

		const response = await request(app)
			.post('/api/histoire')
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					title: 'Histoire de clauzond'
				})
			);

		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe('Title not found');
	});

	test('Test of story creation', async () => {
		const token = await getToken();

		const response = await request(app)
			.post('/api/histoire')
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					titre: 'Histoire de clauzond'
				})
			);

		expect(response.statusCode).toBe(status.CREATED);
		expect(response.body.message).toBe(
			'Story created! Returning story and initial paragraph'
		);

		// Backup id of the story created
		idStory = response.body.histoire.id;
	});
});

describe('GET /api/histoire/:idHistoire', () => {
	test('Test of get story without specify id', async () => {
		const token = await getToken();

		const response = await request(app)
			.get('/api/histoire')
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.NOT_FOUND);
	});

	test('Test of get unknown story', async () => {
		const token = await getToken();

		const response = await request(app)
			.get('/api/histoire/notfound')
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.NOT_FOUND);
		expect(response.body.message).toBe("The story doesn't exist");
	});

	test('Test of get existing story', async () => {
		const token = await getToken();

		const response = await request(app)
			.get(`/api/histoire/${idStory}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Returning story');
	});
});

describe('PUT /api/histoire/:idHistoire', () => {
	test('Test of update story without specify id', async () => {
		const token = await getToken();

		const response = await request(app)
			.put('/api/histoire')
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.NOT_FOUND);
	});

	test('Test of update unknown story', async () => {
		const token = await getToken();

		const response = await request(app)
			.put('/api/histoire/notfound')
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.NOT_FOUND);
		expect(response.body.message).toBe("The story doesn't exist");
	});

	test('Test of update story wrote by another user', async () => {
		const token = await getToken('otherUser');
		const response = await request(app)
			.put(`/api/histoire/${idStory}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);
		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe(
			'You are not allowed to modified this story'
		);
	});

	test('Test of update story without specify correct parameters', async () => {
		const token = await getToken();
		const response = await request(app)
			.put(`/api/histoire/${idStory}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					fakeField: 15,
					anotherFakeField: 'fakeValue'
				})
			);
		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'You must specified estPublique or estOuverte params'
		);
	});

	test('Test of update story with one correct parameter', async () => {
		const token = await getToken();

		let response = await request(app)
			.put(`/api/histoire/${idStory}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					estPublique: true
				})
			);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Story modified');

		response = await request(app)
			.put('/api/histoire/1')
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					estOuverte: true
				})
			);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Story modified');
	});

	test('Test of update story with both correct parameters', async () => {
		const token = await getToken();

		const response = await request(app)
			.put(`/api/histoire/${idStory}`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					estPublique: false,
					estOuverte: false
				})
			);
		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Story modified');
	});
});

describe('GET /api/histoire/:idHistoire/collaborateur', () => {
	test('Test of get collaborators by the author', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const newStory = await createStory("L'histoire de clauzond", user);

		const token = await getToken(user);

		const response = await request(app)
			.get(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);

		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Returning collaborators');
		expect(response.body.collaborators).not.toBe(undefined);

		// Check if the author is added as a collaborator
		const collaborators = response.body.collaborators;
		expect(collaborators.length).toBe(1);
		expect(collaborators[0].id).toBe(user);
	});

	test('Test of get collaborators by a random user', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const newStory = await createStory("L'histoire de clauzond", user);

		const token = await getToken('randomUser');

		const response = await request(app)
			.get(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);

		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe(
			'Only the author can see collaborators list'
		);
	});

	test('Test if a random user is not a collaborator by default', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const newStory = await createStory("L'histoire de clauzond", user);
		const token = await getToken(user);

		// Create randomUser
		const randomUser = 'randomUser';
		await getToken(randomUser);

		const response = await request(app)
			.get(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);

		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe('Returning collaborators');
		expect(response.body.collaborators).not.toBe(undefined);

		// Check if the author is added as a collaborator
		const collaborators = response.body.collaborators;
		expect(collaborators.length).toBe(1);
		expect(collaborators[0].id).not.toBe(randomUser);
	});
});

describe('POST /api/histoire/:idHistoire/collaborateur', () => {
	test('Test of add collaborator to a story', async () => {
		// TODO
	});
});

describe('DELETE /api/histoire/:idHistoire/collaborateur', () => {
	test('Test of remove collaborator to a story', async () => {
		// TODO
	});
});
