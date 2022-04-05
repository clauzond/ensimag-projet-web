import has from 'has-keys';
import status from 'http-status';
import { Op } from 'sequelize';
import { Histoire, Paragraphe } from '../models/index.js';
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

		let stories = { stories: [] };
		// Check the initial paragraph of each story
		for (let story of storiesFromDB) {
			const initParagraph = await story.getParagrapheInitial();
			// Skip story when the content of the first paragraph is empty
			if (initParagraph.contenu.length === 0) continue;

			// Verify that initial paragraph can lead to a conclusion
			if (await initParagraph.leadToConclusion()) {
				stories['stories'].push(story);
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

		const stories = { stories: [] };
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
				stories['stories'].push(story);
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
				'You are not allowed to modified this story',
				status.FORBIDDEN
			);
		}

		// Throws error if the params are not correct
		if (!has(req.body, 'estOuverte') && !has(req.body, 'estPublique')) {
			throw new RequestError(
				'You must specified estPublique or estOuverte params',
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
	}
};

export { checkStoryId };
