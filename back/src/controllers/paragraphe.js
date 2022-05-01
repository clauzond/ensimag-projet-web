import has from 'has-keys';
import status from 'http-status';
import { Op } from 'sequelize';
import { RequestError } from '../util/requestError.js';
import { ChoixTable, Paragraphe } from '../models/index.js';
import { checkIsPrivateStory, checkStoryId } from './histoire.js';

async function checkParagraphId(req) {
	if (!has(req.params, 'idParagraphe')) {
		throw new RequestError(
			'You must specified paragraph id',
			status.BAD_REQUEST
		);
	}

	const paragrapheId = req.params.idParagraphe;

	// Get paragraphe object
	const paragraphe = await Paragraphe.findByPk(paragrapheId);
	if (!paragraphe) {
		throw new RequestError("The paragraph doesn't exist", status.NOT_FOUND);
	}
	return paragraphe;
}

async function checkIfUserIsFree(idUser, idParagraph) {
	// Verify that user is not the redactor of another paragraph
	const nb = (
		await Paragraphe.findAll({
			where: {
				estVerrouille: true,
				idRedacteur: idUser,
				id: { [Op.not]: idParagraph }
			}
		})
	).length;
	if (nb !== 0) {
		throw new RequestError(
			'You are currently writing another paragraph',
			status.FORBIDDEN
		);
	}
}

async function checkIfUserIsWriter(user, paragraph) {
	// Check if the current user is the writer of the paragraph
	if (!(await paragraph.isRedacteur(user))) {
		throw new RequestError(
			'You are not allowed to write on this paragraph',
			status.FORBIDDEN
		);
	}

	return true;
}

async function getValidChoiceArray(idParagraph, history) {
	// Filter choices: only valid paragraph && with choice condition respected
	const choiceRowArray = [];
	const arr = await ChoixTable.findAll({
		where: { ParagrapheId: idParagraph }
	});

	for (const ele of arr) {
		if (
			ele.condition !== null &&
			!history.find(obj => obj.id === ele.condition)
		) {
			continue;
		}
		const choice = await Paragraphe.findByPk(ele.ChoixId);
		if (!choice.estVerrouille && choice.idRedacteur !== null) {
			if (await choice.leadToConclusion()) {
				choiceRowArray.push(ele);
			}
		}
	}

	return choiceRowArray;
}

async function auxGetParagraph(req, res) {
	const story = await checkStoryId(req);

	await checkIsPrivateStory(story, req.user);

	const paragraph = await checkParagraphId(req);

	if (paragraph.estVerrouille === true || paragraph.idRedacteur === null) {
		throw new RequestError('This paragraph is locked', status.FORBIDDEN);
	}

	const history =
		req.user !== undefined ? await req.user.getHistorique(story) : [];

	let choiceRowArray = await getValidChoiceArray(paragraph.id, history);
	const alreadySeen = [paragraph.id];
	while (choiceRowArray.length === 1) {
		const nextParagraph = await Paragraphe.findByPk(
			choiceRowArray[0].ChoixId
		);
		paragraph.contenu += '\n';
		paragraph.contenu += choiceRowArray[0].titreChoix;
		paragraph.contenu += '\n';
		paragraph.contenu += nextParagraph.contenu;
		choiceRowArray = await getValidChoiceArray(nextParagraph.id, history);

		// Avoid circular loops
		if (alreadySeen.includes(nextParagraph.id)) {
			break;
		}
		alreadySeen.push(nextParagraph.id);
	}

	res.json({
		status: true,
		message: 'Returning paragraph and available choiceRowArray',
		story: story,
		paragraph: paragraph,
		choiceRowArray: choiceRowArray
	});
}

export const paragraphe = {
	async getChoiceList(req, res) {
		// #swagger.tags = ['Paragraph']
		// #swagger.summary = Get the list of choices for a paragraph
		/* #swagger.responses[400] = {
			description: 'Validation error',
		} */
		/* #swagger.responses[403] = {
			description: 'User not authorized to access story',
		} */
		/* #swagger.responses[404] = {
			description: 'Story not found',
		} */
		/*
		#swagger.responses[200] = {
			schema: {
				$status: true,
				$message: 'Returning choice list',
				$paragraph: { $ref: '#/definitions/Paragraphe' },
				$choiceList: [{ $ref: '#/definitions/Choix' }],
			}
		}
		*/
		const story = await checkStoryId(req);
		const paragraph = await checkParagraphId(req);

		if (!story.estOuverte && !(await story.isCollaborator(req.user))) {
			throw new RequestError(
				'You are not a collaborator of the story',
				status.BAD_REQUEST
			);
		}

		const choiceList = await paragraph.getChoix();

		res.json({
			status: true,
			message: 'Returning choice list',
			paragraph: paragraph,
			choiceList: choiceList
		});
	},
	// Create paragraph as a choice
	async createParagraph(req, res) {
		// #swagger.tags = ['Paragraph']
		// #swagger.summary = Create paragraph as a choice
		/* #swagger.parameters['json'] = { in: 'body',
		schema: {
			$titreChoix:'Paragraph content',
			$idParagraphe:1,
			$idChoix:1,
			contenu: "Mon paragraphe",
			estConclusion: false,
			condition: false,
		}}
		 */
		/* #swagger.responses[400] = {
			description: 'Validation error, or the choice already exists',
		} */
		/* #swagger.responses[403] = {
			description: 'User not authorized to access story',
		} */
		/* #swagger.responses[404] = {
			description: 'Story not found',
		} */
		/*
		#swagger.responses[200] = {
			schema: {
				$status: true,
				$message: 'Paragraph created',
				$paragraph: { $ref: '#/definitions/Paragraphe' },
				$choiceList: [{ $ref: '#/definitions/Choix' }],
			}
		}
		 */
		const story = await checkStoryId(req);

		// Check if the user is a collaborator of the story
		if (!(await story.isCollaborator(req.user))) {
			throw new RequestError('You are not allowed to create a paragraph');
		}

		if (!has(req.body, 'titreChoix')) {
			throw new RequestError(
				'You must specify titreChoix param',
				status.BAD_REQUEST
			);
		}

		// idParagraphe is the paragraphe which leads to the new choice being created
		if (!has(req.body, 'idParagraphe')) {
			throw new RequestError(
				'You must specify idParagraphe param',
				status.BAD_REQUEST
			);
		}

		// idChoix can be null to create a new paragraph as a choice
		if (!has(req.body, 'idChoix')) {
			throw new RequestError(
				'You must specify idChoix param',
				status.BAD_REQUEST
			);
		}

		const paragraph = await Paragraphe.findByPk(req.body.idParagraphe);
		if (paragraph === null) {
			throw new RequestError(
				'The specified paragraph does not exist',
				status.NOT_FOUND
			);
		}
		let choice;

		if (req.body.idChoix !== null) {
			// Verify that existing paragraph is not already a choice
			const nb = await paragraph.countChoix({
				where: {
					id: req.body.idChoix
				}
			});
			if (nb !== 0) {
				throw new RequestError(
					'The choice made already exists',
					status.BAD_REQUEST
				);
			}

			choice = await Paragraphe.findByPk(req.body.idChoix);
			if (choice === null) {
				throw new RequestError(
					'The specified choice does not exist',
					status.NOT_FOUND
				);
			}
		} else {
			// Create the paragraph
			choice = await Paragraphe.create({
				contenu: has(req.body, 'contenu') ? req.body.contenu : null,
				estVerrouille: false,
				estConclusion: has(req.body, 'estConclusion')
					? req.body.estConclusion
					: false
			});

			if (
				has(req.body, 'contenu') &&
				req.body.contenu != null &&
				req.body.contenu.length !== 0
			) {
				await choice.setRedacteur(req.user);
			}
		}

		// Add choice to ChoixTable
		await paragraph.addChoix(choice, {
			through: {
				titreChoix: req.body.titreChoix,
				condition: has(req.body, 'condition')
					? req.body.condition
					: null
			}
		});

		res.statusCode = status.CREATED;
		res.json({
			status: true,
			message: 'Paragraph created',
			paragraph: paragraph,
			choice: choice
		});
	},
	async getParagraph(req, res) {
		// #swagger.tags = ['Paragraph']
		// #swagger.summary = Get a	paragraph
		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		/* #swagger.responses[403] = {
      description: 'User not authorized to access story',
    } */
		/* #swagger.responses[404] = {
      description: 'Story not found',
    } */
		/*
		#swagger.responses[200] = {
			schema: {
				$status: true,
				$message: 'Returning paragraph and available choiceRowArray',
				$story: { $ref: '#/definitions/Histoire' },
				$paragraph: { $ref: '#/definitions/Paragraphe' },
				$choiceRowArray: [{ $ref: '#/definitions/Choix' }],
			}
		}
		*/
		const story = await checkStoryId(req);
		const paragraph = await checkParagraphId(req);
		const choiceRowArray = await ChoixTable.findAll({
			where: { ParagrapheId: paragraph.id }
		});
		res.json({
			status: true,
			message: 'Returning paragraph',
			story: story,
			paragraph: paragraph,
			choiceRowArray: choiceRowArray
		});
	},
	// Read-only for authentified & unauthentified users
	// If there is only one choice, append the next paragraph
	async getPublicParagraph(req, res) {
		// #swagger.tags = ['Readonly']
		// #swagger.summary = Get a	paragraph
		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		/* #swagger.responses[403] = {
      description: 'User not authorized to access story',
    } */
		/* #swagger.responses[404] = {
      description: 'Story not found',
    } */
		/*
		#swagger.responses[200] = {
			schema: {
				$status: true,
				$message: 'Returning paragraph and available choiceRowArray',
				$story: { $ref: '#/definitions/Histoire' },
				$paragraph: { $ref: '#/definitions/Paragraphe' },
				$choiceRowArray: [{ $ref: '#/definitions/Choix' }],
			}
		}
		*/
		await auxGetParagraph(req, res);
	},
	async getAuthentifiedParagraph(req, res) {
		// #swagger.tags = ['Paragraph']
		// #swagger.summary = Get a	paragraph
		await auxGetParagraph(req, res);
		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		/* #swagger.responses[403] = {
      description: 'User not authorized to access story',
    } */
		/* #swagger.responses[404] = {
      description: 'Story not found',
    } */
		/*
		#swagger.responses[200] = {
			schema: {
				$status: true,
				$message: 'Returning paragraph and available choiceRowArray',
				$story: { $ref: '#/definitions/Histoire' },
				$paragraph: { $ref: '#/definitions/Paragraphe' },
				$choiceRowArray: [{ $ref: '#/definitions/Choix' }],
			}
		}
		*/
	},
	async askToUpdateParagraph(req, res) {
		// #swagger.tags = ['Paragraph']
		// #swagger.summary = Ask to modify a paragraph, acquiring a lock.
		// #swagger.description = Only one user can modify a paragraph at a time. This operation will fail if another user is already editing this paragraph. <br> Once the paragraph is modified, use this route without <code>/modified</code> prefix confirm.
		await checkStoryId(req);
		const paragraph = await checkParagraphId(req);

		// Check if the user can write a paragraph
		await checkIfUserIsFree(req.user.id, paragraph.id);

		// Check if the paragraph is not already written by another user
		if (
			paragraph.idRedacteur !== null &&
			paragraph.idRedacteur !== req.user.id
		) {
			/* #swagger.responses[403] = {
        description: 'Paragraph is being modified by another user',
      } */
			throw new RequestError(
				'This paragraph is already modified by another user',
				status.FORBIDDEN
			);
		}

		if (paragraph.estVerrouille) {
			/* #swagger.responses[400] = {
        description: 'You already locked the paragraph, or validation error',
      } */
			throw new RequestError(
				'This paragraph is already locked',
				status.BAD_REQUEST
			);
		}

		// Set paragraph locked
		await paragraph.update({
			estVerrouille: true
		});

		// Put the user as the writer
		await paragraph.setRedacteur(req.user);

		/*
		#swagger.responses[200] = {
			schema: {
				$status: true,
				$message: 'Paragraph modification allowed',
				$paragraph: { $ref: '#/definitions/Paragraphe' },
			}
		}
		*/
		res.json({
			status: true,
			message: 'Paragraph modification allowed',
			paragraph: paragraph
		});
	},
	async updateParagraph(req, res) {
		// #swagger.tags = ['Paragraph']
		// #swagger.summary = Modify a paragraph.
		// #swagger.description = This is the second step: please query <code>/api/histoire/{idHistoire}/paragraphe/{idParagraphe}/modified</code> first.
		// #swagger.parameters['json'] = { in: 'body', schema: { $content:'Paragraph content'}}
		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		await checkStoryId(req);
		const paragraph = await checkParagraphId(req);

		// Check if the paragraph is already locked w
		// which means that the user ask before edit it
		if (paragraph.estVerrouille !== true) {
			throw new RequestError(
				'The paragraph is not locked, you are not allowed to edit it',
				status.FORBIDDEN
			);
		}

		// Check if the content of the paragraph is present
		if (
			!has(req.body, 'contenu') ||
			req.body.contenu == null ||
			req.body.contenu.length === 0
		) {
			/* #swagger.responses[400] = {
        description: 'Validation error',
      } */
			throw new RequestError(
				'Content cannot be null or empty',
				status.BAD_REQUEST
			);
		}

		// Check that user can write on this paragraph
		/* #swagger.responses[403] = {
      description: 'Paragraph has to be locked first, or you are not allowed to modify this paragraph',
    } */
		await checkIfUserIsWriter(req.user, paragraph);

		// Update paragraph data if it's different
		// If it's the same, don't bother updating but tell the client
		// the update was successful anyway
		if (req.body.contenu !== paragraph.contenu) {
			await paragraph.update({
				contenu: String(req.body.contenu),
				estVerrouille: false
			});
		} else if (paragraph.estVerrouille) {
			await paragraph.update({ estVerrouille: false });
		}

		/*
		#swagger.responses[200] = {
			schema: {
				$status: true,
				$message: 'Paragraph has been successfully modified',
				$paragraph: { $ref: '#/definitions/Paragraphe' },
			}
		}
		*/
		res.json({
			status: true,
			message: 'Paragraph has been successfully modified',
			paragraph: paragraph
		});
	},
	async cancelModification(req, res) {
		// #swagger.tags = ['Paragraph']
		// #swagger.summary = Release lock on a paragraph

		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		const story = await checkStoryId(req);
		const paragraph = await checkParagraphId(req);

		/* #swagger.responses[403] = {
      description: 'You are not allowed to modify this paragraph',
    } */
		// Verify that user is the writer of the paragraph
		await checkIfUserIsWriter(req.user, paragraph);

		// Verify that paragraph is not the initial paragraph of the story
		if (story.idParagrapheInitial === paragraph.id) {
			throw new RequestError(
				'You cannot abandon the initial paragraph',
				status.FORBIDDEN
			);
		}

		// Remove writer status of the user
		await paragraph.setRedacteur(null);

		// Unlock paragraph
		await paragraph.update({
			estVerrouille: false
		});

		/*
		#swagger.responses[200] = {
			schema: {
				$status: true,
				$message: 'Modification canceled',
				$paragraph: { $ref: '#/definitions/Paragraphe' },
			}
		}
		*/
		res.json({
			status: true,
			message: 'Modification canceled',
			paragraph: paragraph
		});
	},
	async deleteParagraph(req, res) {
		// #swagger.tags = ['Paragraph']
		// #swagger.summary = Delete a paragraph

		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		const story = await checkStoryId(req);
		const paragraph = await checkParagraphId(req);

		// Check that the paragraph is not the initial paragraph
		if (story.idParagrapheInitial === paragraph.id) {
			throw new RequestError(
				'You cannot delete the initial paragraph',
				status.BAD_REQUEST
			);
		}

		// Check that the paragraph does not lead to other paragraphs
		const nbChoix = await paragraph.countChoix();
		if (nbChoix > 0) {
			throw new RequestError(
				'You cannot delete a paragraph with choices',
				status.BAD_REQUEST
			);
		}

		// For every paragraph which has this one as a choice,
		// remove the choice and update its state to locked
		// if it becomes invalid
		const arrayChoix = await ChoixTable.findAll({
			where: { ChoixId: paragraph.id }
		});
		for (const choix of arrayChoix) {
			const paragraphChoix = await Paragraphe.findOne({
				where: { id: choix.ParagrapheId }
			});
			// Update the state of paragraphChoix (it can become locked)
			await paragraphChoix.updateState();
			// Destroy the choice leading to the paragraph
			await choix.destroy();
		}

		// Remove the paragraph from the database
		await paragraph.destroy();

		res.json({
			status: true,
			message: 'Paragraph has been successfully deleted'
		});
	}
};

export { checkParagraphId };
