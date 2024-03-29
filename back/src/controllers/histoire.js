import has from 'has-keys';
import status from 'http-status';
import { Op } from 'sequelize';
import { Histoire, Paragraphe, Utilisateur } from '../models/index.js';
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

async function checkIsPrivateStory(story, user) {
	// Check if the reader is allowed to get the story
	const initParagraph = await story.getParagrapheInitial();
	const isParagraphCorrect =
		initParagraph.estVerrouille === false &&
		initParagraph.contenu !== null &&
		initParagraph.contenu.length !== 0 &&
		(await initParagraph.leadToConclusion());
	const userCanAccess =
		story.estPublique ||
		(user !== undefined && (await story.hasCollaborateur(user)));
	if (!userCanAccess || !isParagraphCorrect) {
		throw new RequestError('This story is private', status.FORBIDDEN);
	}
}

export const story = {
	async getParagraphList(req, res) {
		// #swagger.tags = ['Story']
		// #swagger.summary = Returns paragraph (valid and invalid ones) from a specified story

		// Get story object
		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		const story = await checkStoryId(req);

		const initialParagraph = await story.getParagrapheInitial();
		const t = {
			id: initialParagraph.id,
			titre: story.titre,
			contenu: initialParagraph.contenu,
			estConclusion: initialParagraph.estConclusion,
			estVerrouille: initialParagraph.estVerrouille,
			idRedacteur: initialParagraph.idRedacteur,
			choices: [...(await initialParagraph.getChoix())].map(
				e => e.contenu
			)
		};

		const toVisit = [...(await initialParagraph.getChoix())];
		const alreadySeen = [{ id: initialParagraph.id, ParentId: null }]; // id list
		const paragraphDict = {}; // paragraph list
		paragraphDict[t.id] = t;

		// Breadth-first search
		while (toVisit.length > 0) {
			const paragraph = toVisit.pop();
			if (
				alreadySeen.some(obj => {
					return (
						obj.id === paragraph.id &&
						obj.ParentId === paragraph.ChoixTable.ParagrapheId
					);
				})
			) {
				continue;
			}

			// Add choice to alreadySeen
			alreadySeen.push({
				id: paragraph.id,
				ParentId: paragraph.ChoixTable.ParagrapheId
			});
			// Add paragraph to list, and if a choice already exists, expand the title
			if (paragraphDict[paragraph.id] == null) {
				paragraphDict[paragraph.id] = {
					id: paragraph.id,
					titre: paragraph.ChoixTable.titreChoix,
					contenu: paragraph.contenu,
					estConclusion: paragraph.estConclusion,
					estVerrouille: paragraph.estVerrouille,
					idRedacteur: paragraph.idRedacteur,
					choices: [...(await paragraph.getChoix())].map(
						e => e.contenu
					)
				};
			} else {
				paragraphDict[paragraph.id].titre +=
					'\n' + paragraph.ChoixTable.titreChoix;
			}
			// Continue search
			toVisit.push(...(await paragraph.getChoix()));
		}

		const paragraphList = [];
		for (const key in paragraphDict) {
			paragraphList.push(paragraphDict[key]);
		}

		/* #swagger.responses[200] = {
			schema: { $status:true, $message: 'Returning paragraph list',
			$paragraphList: [{ $ref: '#/definitions/Paragraphe' }]}
		} */
		res.json({
			status: true,
			message: 'Returning paragraph list',
			paragraphList: paragraphList
		});
	},

	async getPublicStories(req, res) {
		// #swagger.tags = ['Readonly']
		// #swagger.summary = Get all public stories
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

		/* #swagger.responses[200] = {
			schema: { $status:true, $message: 'Returning public stories',
			$stories: [{ $ref: '#/definitions/HistoirePara' }]}
		} */
		res.json({
			status: true,
			message: 'Returning public stories',
			stories: stories
		});
	},

	async getPublicAuthentifiedStories(req, res) {
		// #swagger.tags = ['Story']
		// #swagger.summary = Get all public stories
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
			if (!story.estPublique && !(await story.hasCollaborateur(req.user)))
				continue;

			const initParagraph = await story.getParagrapheInitial();
			// Skip story when the content of the first paragraph is empty
			if (initParagraph.contenu.length === 0) continue;

			// Verify that initial paragraph can lead to a conclusion
			if (await initParagraph.leadToConclusion()) {
				stories.push(story);
			}
		}

		/* #swagger.responses[200] = {
			schema: { $status:true, $message: 'Returning stories',
			$data: [{ $ref: '#/definitions/HistoirePara' }]}
		} */
		res.json({
			status: true,
			message: 'Returning stories',
			stories: stories
		});
	},

	async getUserStories(req, res) {
		// #swagger.tags = ['Story']
		// #swagger.summary = Get all stories belonging to the current user
		const stories = await req.user.getHistoire();

		/* #swagger.responses[200] = {
			schema: { $status:true, $message: 'Returning stories',
			$data: [{ $ref: '#/definitions/Histoire' }]}
		} */
		res.json({
			status: true,
			message: 'Returning stories',
			stories: stories
		});
	},

	async createStory(req, res) {
		// #swagger.tags = ['Story']
		// #swagger.summary = Create a story
		// #swagger.parameters['json'] = { in: 'body', description:'Story', schema: { $ref: '#/definitions/AddStory' }}

		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
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
		/*
		#swagger.responses[201] = {
			schema: {
				$status: true,
				$message: 'Story created! Returning story and initial paragraph',
				histoire: { $ref: '#/definitions/Histoire' },
				paragrapheInitial: { $ref: '#/definitions/Paragraphe' }
			}
		}
		*/
		res.json({
			status: true,
			message: 'Story created! Returning story and initial paragraph',
			histoire: histoire,
			paragrapheInitial: paragrapheInitial
		});
	},
	async updateStory(req, res) {
		// #swagger.tags = ['Story']
		// #swagger.summary = Update a story (must be the author)
		// #swagger.parameters['json'] = { in: 'body', description:'Story', schema: { $ref: '#/definitions/AddStory' }}

		// Get story object
		const story = await checkStoryId(req);

		/* #swagger.responses[403] = {
      description: 'User is not the author of the story',
    } */
		// Check if the user is the author
		if (!(await story.isAuthor(req.user))) {
			throw new RequestError(
				'You are not allowed to modify this story',
				status.FORBIDDEN
			);
		}

		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
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
				estPublique: req.body.estPublique
			});
		}
		if (has(req.body, 'estOuverte')) {
			await story.update({
				estOuverte: req.body.estOuverte
			});
		}

		/*
		#swagger.responses[201] = {
			schema: {
				$status: true,
				$message: 'Story modified',
				histoire: { $ref: '#/definitions/Histoire' },
			}
		}
		*/
		res.json({
			status: true,
			message: 'Story modified',
			histoire: story
		});
	},
	async getStory(req, res) {
		// #swagger.tags = ['Story']
		// #swagger.summary = Get a story

		// Get story object
		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		const story = await checkStoryId(req);
		/*
		#swagger.responses[201] = {
			schema: {
				$status: true,
				$message: 'Returning story',
				story: { $ref: '#/definitions/Histoire' },
			}
		}
		*/
		res.json({ status: true, message: 'Returning story', story: story });
	},
	async getPublicStory(req, res) {
		// #swagger.tags = ['Readonly']
		// #swagger.summary = Get a public story

		// Get story object
		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		const story = await checkStoryId(req);
		/* #swagger.responses[403] = {
      description: 'Private story',
    } */
		await checkIsPrivateStory(story, req.user);
		/*
		#swagger.responses[201] = {
			schema: {
				$status: true,
				$message: 'Returning story',
				story: { $ref: '#/definitions/Histoire' },
			}
		}
		*/
		res.json({ status: true, message: 'Returning story', story: story });
	},
	async getCollaborators(req, res) {
		// #swagger.tags = ['Story']
		// #swagger.summary = Get the collaborators for a story

		// Get story object
		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		const story = await checkStoryId(req);

		/* #swagger.responses[403] = {
      description: 'User is not author of this story',
    } */
		// Only the author of the story can see all collaborators
		if (!(await story.isAuthor(req.user))) {
			throw new RequestError(
				'Only the author can see collaborators list',
				status.FORBIDDEN
			);
		}

		// Get collaborators
		const collaborators = await story.getCollaborateur();

		// Remove password from results
		for (const collaborator of collaborators) {
			collaborator.pwd = undefined;
		}

		/*
		#swagger.responses[201] = {
			schema: {
				$status: true,
				$message: 'Returning collaborators',
				collaborators: ['root', 'root2'],
			}
		}
		*/
		res.json({
			status: true,
			message: 'Returning collaborators',
			collaborators: collaborators
		});
	},
	async addCollaborator(req, res) {
		// #swagger.tags = ['Story']
		// #swagger.summary = Add a collaborator to a story

		// Get story object
		/* #swagger.responses[400] = {
      description: 'User is already a collaborator, or validation error',
    } */
		const story = await checkStoryId(req);

		/* #swagger.responses[403] = {
      description: 'User is not author of this story',
    } */
		// Only the story author can add collaborators
		if (!(await story.isAuthor(req.user))) {
			throw new RequestError(
				'Only the author of the story can add or remove collaborators',
				status.FORBIDDEN
			);
		}

		if (!has(req.body, 'idCollaborateur')) {
			throw new RequestError(
				'You must specify idCollaborateur param',
				status.BAD_REQUEST
			);
		}

		// Verify that collaborator exists in database
		const collaborator = await Utilisateur.findByPk(
			req.body.idCollaborateur
		);
		if (collaborator === null) {
			/* #swagger.responses[404] = {
        description: 'User specified in idCollaborateur not found',
      } */
			throw new RequestError(
				'User specified in idCollaborateur was not found',
				status.NOT_FOUND
			);
		}

		// Verify that collaborator is not already added
		if (await story.hasCollaborateur(collaborator)) {
			throw new RequestError(
				'User specified in idCollaborateur is already a collaborator of this story',
				status.BAD_REQUEST
			);
		}

		await story.addCollaborateur(collaborator);

		/*
		#swagger.responses[201] = {
			schema: {
				$status: true,
				$message: 'User added as collaborator of the story',
				story: { $ref: '#/definitions/Histoire' },
				collaborator: 'root',
			}
		}
		*/
		res.json({
			status: true,
			message: 'User added as collaborator of the story',
			story: story,
			collaborator: collaborator
		});
	},
	async setCollaborators(req, res) {
		// #swagger.tags = ['Story']
		// #swagger.summary = Set the collaborators for a story

		// Get story object
		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		const story = await checkStoryId(req);

		/* #swagger.responses[403] = {
      description: 'User is not author of this story, or trying to remove yourself from collaborators',
    } */
		// Only the story author can add collaborators
		if (!(await story.isAuthor(req.user))) {
			throw new RequestError(
				'Only the author of the story can add or remove collaborators',
				status.FORBIDDEN
			);
		}

		if (!has(req.body, 'idCollaborateurs')) {
			throw new RequestError(
				'You must specify idCollaborateur param',
				status.BAD_REQUEST
			);
		}

		let authorPresentInList = false;
		for (const collaboratorFromReq of req.body.idCollaborateurs) {
			// Verify that collaborator exists in database
			const collaborator = await Utilisateur.findByPk(
				collaboratorFromReq
			);
			if (collaborator === null) {
				/* #swagger.responses[404] = {
        description: 'User specified in idCollaborateur not found',
        } */
				throw new RequestError(
					'User specified in idCollaborateur was not found',
					status.NOT_FOUND
				);
			}

			// The author must be in collaborators list
			if (req.user.id === collaborator.id) {
				authorPresentInList = true;
			}
		}

		if (!authorPresentInList) {
			throw new RequestError(
				'You cannot remove yourself from collaborators',
				status.FORBIDDEN
			);
		}

		await story.setCollaborateur(req.body.idCollaborateurs);

		res.json({
			status: true,
			message: 'Collaborators are set'
		});
	},
	async removeCollaborator(req, res) {
		// #swagger.tags = ['Story']
		// #swagger.summary = Remove a collaborator from a story

		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		// Get story object
		const story = await checkStoryId(req);

		// Only the story author can add collaborators
		if (!(await story.isAuthor(req.user))) {
			/* #swagger.responses[403] = {
        description: 'User is not author of this story, or trying to remove yourself from collaborators',
      } */
			throw new RequestError(
				'Only the author of the story can add or remove collaborators',
				status.FORBIDDEN
			);
		}

		if (!has(req.body, 'idCollaborateur')) {
			throw new RequestError(
				'You must specify idCollaborateur param',
				status.BAD_REQUEST
			);
		}

		// The author cannot remove himself from collaborators
		if (req.user.id === req.body.idCollaborateur) {
			throw new RequestError(
				'You cannot remove yourself from collaborators',
				status.FORBIDDEN
			);
		}

		// Verify that collaborator exists in database
		const collaborator = await Utilisateur.findByPk(
			req.body.idCollaborateur
		);
		if (collaborator === null) {
			/* #swagger.responses[404] = {
        description: 'User specified in idCollaborateur not found',
      } */
			throw new RequestError(
				'User specified in idCollaborateur was not found',
				status.NOT_FOUND
			);
		}

		// Verify that user is already a collaborator
		if (!(await story.hasCollaborateur(collaborator))) {
			throw new RequestError(
				'User specified in idCollaborateur is not a collaborator of this story',
				status.BAD_REQUEST
			);
		}

		await story.removeCollaborateur(collaborator);

		/*
		#swagger.responses[200] = {
			schema: {
				$status: true,
				$message: 'Successfully removed collaborator from story',
				story: { $ref: '#/definitions/Histoire' },
			}
		}
		*/
		res.json({
			status: true,
			message: 'Successfully removed collaborator from story',
			story: story
		});
	}
};

export { checkStoryId, checkIsPrivateStory };
