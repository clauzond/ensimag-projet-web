import has from 'has-keys';
import status from 'http-status';
import { Op } from 'sequelize';
import { Utilisateur, Histoire, Paragraphe } from '../models/index.js';
import { RequestError } from '../util/requestError.js';

async function checkStoryId(req) {
	if (!has(req.params, 'idHistoire')) {
		throw new RequestError(
			'You must specified story id',
			status.BAD_REQUEST
		);
	}

	const storyId = req.params.idHistoire;

	// Get story
	const story = await Histoire.findByPk(storyId);
	if (!story) {
		throw new RequestError("The story doesn't exist", status.NOT_FOUND);
	}
	return story;
}

async function checkIsPrivateStory(story) {
	// Check if the reader is allowed to get the story
	const initParagraph = await story.getParagrapheInitial();
	const isParagraphCorrect =
		initParagraph.estVerrouille === false &&
		initParagraph.contenu !== null &&
		initParagraph.contenu.length !== 0 &&
		(await initParagraph.leadToConclusion());

	if (story.estPublique === false || !isParagraphCorrect) {
		throw new RequestError('This story is private', status.FORBIDDEN);
	}
}

export const story = {
	async getPublicStories(req, res) {
		const storiesFromDB = await Histoire.findAll({
			include: [
				{
					model: Paragraphe,
					as: 'ParagrapheInitial',
					where: {
						contenu: {
							[Op.not]: null
						},
						estVerrouille: false
					}
				}
			],
			where: { estPublique: true }
		});

		let stories = [];
		// Check the initial paragraph of each story
		for (let story of storiesFromDB) {
			const initParagraph = await story.getParagrapheInitial();
			// Skip story when the content of the first paragraph is empty
			if (initParagraph.contenu.length === 0) continue;

			// Verify that initial paragraph can lead to a conclusion
			if (await initParagraph.leadToConclusion()) {
				stories.push(story);
			}
		}

		res.json({
			status: true,
			message: 'Returning public stories',
			stories: stories
		});
	},

	async getPublicAuthentifiedStories(req, res) {
		const storiesFromDB = await Histoire.findAll({
			include: [
				{
					model: Paragraphe,
					as: 'ParagrapheInitial',
					where: {
						contenu: {
							[Op.not]: null
						},
						estVerrouille: false
					}
				}
			]
		});

		const stories = [];
		// Check the initial paragraph of each story
		for (const story of storiesFromDB) {
			// Verify that user has access to the story
			if (!story.estPublique && !story.hasCollaborateur(req.user))
				continue;

			const initParagraph = await story.getParagrapheInitial();
			// Skip story when the content of the first paragraph is empty
			if (initParagraph.contenu.length === 0) continue;

			// Verify that initial paragraph can lead to a conclusion
			if (await initParagraph.leadToConclusion()) {
				stories.push(story);
			}
		}

		res.json({
			status: true,
			message: 'Returning public stories',
			stories: stories
		});
	},

	async createStory(req, res) {
		if (!has(req.body, 'titre')) {
			throw new RequestError('Title not found', status.BAD_REQUEST);
		}

		// Création de l'histoire
		// par défaut, l'histoire est fermée, non publique
		const histoire = await Histoire.create({
			titre: req.body.titre,
			estOuverte: has(req.body, 'estOuverte')
				? req.body.estOuverte
				: false,
			estPublique: has(req.body, 'estPublique')
				? req.body.estPublique
				: false
		});

		// Ajout de l'utilisateur en tant qu'auteur
		await histoire.setAuteur(req.user);

		// Ajout de l'utilisateur dans les collaborateurs
		await histoire.addCollaborateur(req.user);

		// Création du paragraphe initial
		const paragrapheInitial = await Paragraphe.create({
			contenu: null,
			estVerrouille: true,
			estConclusion: false
		});

		// Ajout de l'utilisateur en tant que rédacteur du paragraphe initial
		await paragrapheInitial.setRedacteur(req.user);

		// Ajout du paragraphe initial à l'histoire
		await histoire.setParagrapheInitial(paragrapheInitial);

		res.statusCode = status.CREATED;
		res.json({
			status: true,
			message: 'Story created! Returning story and initial paragraph',
			histoire: histoire,
			paragrapheInitial: paragrapheInitial
		});
	},
	async updateStory(req, res) {
		// Get story object
		const story = await checkStoryId(req);

		// Check if the user is the author
		if (!(await story.isAuthor(req.user))) {
			throw new RequestError(
				'You are not allowed to modify this story',
				status.FORBIDDEN
			);
		}

		// Throws error if the params are not correct
		if (!has(req.body, 'estOuverte') && !has(req.body, 'estPublique')) {
			throw new RequestError(
				'You must specify estPublique or estOuverte params',
				status.BAD_REQUEST
			);
		}

		// Change story params
		if (has(req.body, 'estPublique')) {
			await story.update({
				estPublique: req.params.estPublique
			});
		}
		if (has(req.body, 'estOuverte')) {
			await story.update({
				estOuvert: req.params.estOuverte
			});
		}

		res.json({
			status: true,
			message: 'Story modified',
			histoire: story
		});
	},
	async getStory(req, res) {
		// Get story object
		const story = await checkStoryId(req);
		res.json({ status: true, message: 'Returning story', story: story });
	},
	async getPublicStory(req, res) {
		// Get story object
		const story = await checkStoryId(req);
		await checkIsPrivateStory(story);
		res.json({ status: true, message: 'Returning story', story: story });
	},
	async addCollaborator(req, res) {
		// Get story object
		const story = await checkStoryId(req);

		// Only the story author can add collaborators
		if (!(await story.isAuthor(req.user))) {
			throw new RequestError(
				'Only the author of the story can add or remove collaborators',
				status.FORBIDDEN
			);
		}

		if (!has(req.body, "idCollaborateur")) {
			throw new RequestError(
				'You must specify idCollaborateur param',
				status.BAD_REQUEST
			);
		}

		// Verify that collaborator exists in database
		const collaborator = await Utilisateur.findByPk(req.body.idCollaborateur);
		if (collaborator === null) {
			throw new RequestError(
				'User specified in idCollaborateur was not found',
				status.BAD_REQUEST
			);
		}

		// Verify that collaborator is not already added
		if (await story.hasCollaborateur(collaborator)) {
			throw new RequestError(
				'User specified in idCollaborateur is already a collaborator of this story',
				status.NOT_MODIFIED
			);
		}

		await story.addCollaborateur(collaborator);

		res.json({ status: true, message: 'User added as collaborator of the story', story: story, collaborator: collaborator });
	},
	async removeCollaborator(req, res) {
		// Get story object
		const story = await checkStoryId(req);

		// Only the story author can add collaborators
		if (!(await story.isAuthor(req.user))) {
			throw new RequestError(
				'Only the author of the story can add or remove collaborators',
				status.FORBIDDEN
			);
		}

		if (!has(req.body, "idCollaborateur")) {
			throw new RequestError(
				'You must specify idCollaborateur param',
				status.BAD_REQUEST
			);
		}

		// Verify that collaborator exists in database
		const collaborator = await Utilisateur.findByPk(req.body.idCollaborateur);
		if (collaborator === null) {
			throw new RequestError(
				'User specified in idCollaborateur was not found',
				status.BAD_REQUEST
			);
		}

		// Verify that user is already a collaborator
		if (!(await story.hasCollaborateur(collaborator))) {
			throw new RequestError(
				'User specified in idCollaborateur is not a collaborator of this story',
				status.NOT_MODIFIED
			);
		}

		await story.removeCollaborator(collaborator);

		res.json({ status: true, message: 'Successfully removed collaborator from story', story: story });
	}
};

export { checkStoryId, checkIsPrivateStory };
