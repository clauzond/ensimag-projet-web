import { app } from '../app.js';
import request from 'supertest';
import status from 'http-status';
import { createStory, getToken } from './util/setupDb.js';
let idStory;

describe('GET /api/histoire', () => {
	test('Test of get a public story', async () => {
		// Init a public story with a valid paragraph (with content and that lead to conclusion)
		const username = 'clauzond';
		const token = getToken(username);
		const storyTitle = "L'histoire publique de clauzond";
		const firstParagraphContent = 'Ceci est le paragraphe de clauzond';
		await createStory(
			storyTitle,
			username,
			true,
			firstParagraphContent,
			true
		);

		console.log(token);

		const response = await request(app)
			.get(`/api/histoire`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);

		// TODO: error 500 ??
		console.log(response.body.message);

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

		const response = await request(app).get('/api/histoire');
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

		const response = await request(app).get('/api/histoire');
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

		const response = await request(app).get('/api/histoire');
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
			'You are not allowed to modify this story'
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
			'You must specify estPublique or estOuverte params'
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

	test('Test of get collaborators for an unknown story', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const token = await getToken(user);
		await createStory("L'histoire de clauzond", user);

		const response = await request(app)
			.get(`/api/histoire/unknownId/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);

		expect(response.statusCode).toBe(status.NOT_FOUND);
		expect(response.body.message).toBe("The story doesn't exist");
	});
});

describe('POST /api/histoire/:idHistoire/collaborateur', () => {
	test('Test of add collaborator to a story', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const newStory = await createStory("L'histoire de clauzond", user);

		const token = await getToken(user);

		// Create collaborator profile
		const collaboratorName = 'leCollabo';
		await getToken(collaboratorName);

		const response = await request(app)
			.post(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					idCollaborateur: collaboratorName
				})
			);

		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe(
			'User added as collaborator of the story'
		);
		expect(response.body.story.id).toBe(newStory.id);
		expect(response.body.collaborator.id).toBe(collaboratorName);
	});

	test('Test of add  twice collaborator to a story', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const token = await getToken(user);
		const newStory = await createStory("L'histoire de clauzond", user);

		// Create collaborator profile
		const collaboratorName = 'leCollabo';
		await getToken(collaboratorName);

		await request(app)
			.post(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					idCollaborateur: collaboratorName
				})
			);

		// Add again the user as collaborator
		const response = await request(app)
			.post(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					idCollaborateur: collaboratorName
				})
			);
		expect(response.statusCode).toBe(status.NOT_MODIFIED);
	});

	test('Test of add collaborator without specify parameter', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const newStory = await createStory("L'histoire de clauzond", user);

		const token = await getToken(user);

		// Create collaborator profile
		const collaboratorName = 'leCollabo';
		await getToken(collaboratorName);

		const response = await request(app)
			.post(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);

		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'You must specify idCollaborateur param'
		);
	});

	test('Test of add collaborator with bad parameter', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const newStory = await createStory("L'histoire de clauzond", user);

		const token = await getToken(user);

		// Create collaborator profile
		const collaboratorName = 'leCollabo';
		await getToken(collaboratorName);

		const response = await request(app)
			.post(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					collaborator: collaboratorName
				})
			);

		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'You must specify idCollaborateur param'
		);
	});

	test('Test of add collaborator by user who is not the author', async () => {
		let response;

		// Create a basic story
		const user = 'clauzondLeCollabo';
		const token = getToken(user);
		const newStory = await createStory("L'histoire de clauzond", user);

		// Create a random user profile
		const collaboratorName = 'leCollabo';
		const tokenCollabo = await getToken(collaboratorName);

		// Try to add a collaborator with a random user profile
		response = await request(app)
			.post(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', tokenCollabo)
			.send(
				JSON.stringify({
					idCollaborateur: collaboratorName
				})
			);

		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe(
			'Only the author of the story can add or remove collaborators'
		);

		// Add the random user as a collaborator with author profile
		await request(app)
			.post(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					idCollaborateur: collaboratorName
				})
			);

		// Create another random user profile
		const randomUser = 'leCollaboRandom';
		await getToken(randomUser);

		// Try to add a collaborator with a collaborator profile
		response = await request(app)
			.post(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', tokenCollabo)
			.send(
				JSON.stringify({
					idCollaborateur: randomUser
				})
			);

		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe(
			'Only the author of the story can add or remove collaborators'
		);
	});

	test('Test of add collaborator for an unknown story', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		await createStory("L'histoire de clauzond", user);

		const token = await getToken(user);

		const response = await request(app)
			.post(`/api/histoire/unknownId/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);

		expect(response.statusCode).toBe(status.NOT_FOUND);
		expect(response.body.message).toBe("The story doesn't exist");
	});

	test('Test of add collaborator with an unknown user', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const token = await getToken(user);
		const newStory = await createStory("L'histoire de clauzond", user);

		const response = await request(app)
			.post(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					idCollaborateur: 'unknownUser'
				})
			);

		expect(response.statusCode).toBe(status.NOT_FOUND);
		expect(response.body.message).toBe(
			'User specified in idCollaborateur was not found'
		);
	});
});

describe('DELETE /api/histoire/:idHistoire/collaborateur', () => {
	test('Test of remove collaborator to a story', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const newStory = await createStory("L'histoire de clauzond", user);

		const token = await getToken(user);

		// Create collaborator profile
		const collaboratorName = 'leCollabo';
		await getToken(collaboratorName);

		// Add collaborator
		await request(app)
			.post(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					idCollaborateur: collaboratorName
				})
			);

		// Delete the user added as collaborator
		const response = await request(app)
			.delete(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					idCollaborateur: collaboratorName
				})
			);

		expect(response.statusCode).toBe(status.OK);
		expect(response.body.message).toBe(
			'Successfully removed collaborator from story'
		);
		expect(response.body.story.id).toBe(newStory.id);
	});

	test('Test of remove a user who was not a collaborator', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const newStory = await createStory("L'histoire de clauzond", user);

		const token = await getToken(user);

		// Fake collaborator profile
		const collaboratorName = 'leCollabo';

		// Delete the user
		const response = await request(app)
			.delete(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					idCollaborateur: collaboratorName
				})
			);

		expect(response.statusCode).toBe(status.NOT_MODIFIED);
	});

	test('Test of remove the author to a story', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const newStory = await createStory("L'histoire de clauzond", user);

		const token = await getToken(user);

		// Delete the author from collaborators
		const response = await request(app)
			.delete(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					idCollaborateur: user
				})
			);

		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe(
			'You cannot remove yourself from collaborators'
		);
	});

	test('Test of delete collaborator without specify parameter', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const newStory = await createStory("L'histoire de clauzond", user);

		const token = await getToken(user);

		// Create collaborator profile
		const collaboratorName = 'leCollabo';
		await getToken(collaboratorName);

		const response = await request(app)
			.delete(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);

		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'You must specify idCollaborateur param'
		);
	});

	test('Test of delete collaborator with bad parameter', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const newStory = await createStory("L'histoire de clauzond", user);

		const token = await getToken(user);

		// Create collaborator profile
		const collaboratorName = 'leCollabo';
		await getToken(collaboratorName);

		const response = await request(app)
			.delete(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					collaborator: collaboratorName
				})
			);

		expect(response.statusCode).toBe(status.BAD_REQUEST);
		expect(response.body.message).toBe(
			'You must specify idCollaborateur param'
		);
	});

	test('Test of delete collaborator by user who is not the author', async () => {
		let response;

		// Create a basic story
		const user = 'clauzondLeCollabo';
		const token = getToken(user);
		const newStory = await createStory("L'histoire de clauzond", user);

		// Create a random user profile
		const collaboratorName = 'leCollabo';
		const tokenCollabo = await getToken(collaboratorName);

		// Try to add a collaborator with a random user profile
		response = await request(app)
			.delete(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', tokenCollabo)
			.send(
				JSON.stringify({
					idCollaborateur: collaboratorName
				})
			);

		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe(
			'Only the author of the story can add or remove collaborators'
		);

		// Add the random user as a collaborator with author profile
		await request(app)
			.delete(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					idCollaborateur: collaboratorName
				})
			);

		// Create another random user profile
		const randomUser = 'leCollaboRandom';
		await getToken(randomUser);

		// Try to add a collaborator with a collaborator profile
		response = await request(app)
			.delete(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', tokenCollabo)
			.send(
				JSON.stringify({
					idCollaborateur: randomUser
				})
			);

		expect(response.statusCode).toBe(status.FORBIDDEN);
		expect(response.body.message).toBe(
			'Only the author of the story can add or remove collaborators'
		);
	});

	test('Test of delete collaborator for an unknown story', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const token = await getToken(user);
		await createStory("L'histoire de clauzond", user);

		const response = await request(app)
			.delete(`/api/histoire/unknownId/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token);

		expect(response.statusCode).toBe(status.NOT_FOUND);
		expect(response.body.message).toBe("The story doesn't exist");
	});

	test('Test of delete collaborator with an unknown user', async () => {
		// Create a basic story
		const user = 'clauzondLeCollabo';
		const token = await getToken(user);
		const newStory = await createStory("L'histoire de clauzond", user);

		const response = await request(app)
			.delete(`/api/histoire/${newStory.id}/collaborateur`)
			.set('Content-Type', 'application/json')
			.set('x-access-token', token)
			.send(
				JSON.stringify({
					idCollaborateur: 'unknownUser'
				})
			);

		expect(response.statusCode).toBe(status.NOT_FOUND);
		expect(response.body.message).toBe(
			'User specified in idCollaborateur was not found'
		);
	});
});
