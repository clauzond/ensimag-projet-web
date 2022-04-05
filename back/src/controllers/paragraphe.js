import has from 'has-keys';
import { RequestError } from '../util/requestError.js';
import status from 'http-status';
import { Paragraphe, ChoixTable } from '../models/index.js';
import { checkStoryId } from './histoire.js';

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

async function verifyUserIsFree(idUser) {
	// Verify that user is not the redactor of another paragraph
	const nb = await Paragraphe.findAndCountAll({
		where: { estVerrouille: true, idRedacteur: idUser }
	});
	return nb === 0;
}

async function checkIfUserIsWriter(user, paragraph) {
	// Check if the current user is the writer of the paragraph
	if (await paragraph.isRedacteur(user)) {
		throw new RequestError(
			'You are not allowed to write on this paragraph',
			status.FORBIDDEN
		);
	}

	return true;
}

export const paragraphe = {
	// Create paragraph as a choice
	async createParagraph(req, res) {
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
			// Create an empty paragraph
			choice = await Paragraphe.create({
				contenu: null,
				estVerrouille: false,
				estConclusion: false
			});
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
		const story = await checkStoryId(req);
		const paragraph = await checkParagraphId(req);

		res.json({
			status: true,
			message: 'Returning paragraph',
			story: story,
			paragraph: paragraph
		});
	},
	async askToUpdateParagraph(req, res) {
		await checkStoryId(req);
		const paragraph = await checkParagraphId(req);

		// Check if the user can write a paragraph
		if (!(await verifyUserIsFree(req.user.id))) {
			throw new RequestError(
				'You are currently write another paragraph',
				status.FORBIDDEN
			);
		}

		// Check if the paragraph is not already written by another user
		if (
			paragraph.estVerrouille ||
			(paragraph.idRedacteur != null &&
				paragraph.idRedacteur !== req.user.id)
		) {
			throw new RequestError(
				'This paragraph is already modified by another user',
				status.FORBIDDEN
			);
		}

		// Set paragraph locked
		await paragraph.update({
			estVerrouille: true
		});

		// Put the user as the writer
		await paragraph.setRedacteur(req.user);

		res.json({
			status: true,
			message: 'Paragraph modification allowed',
			paragraph: paragraph
		});
	},
	async updateParagraph(req, res) {
		await checkStoryId(req);
		const paragraph = await checkParagraphId(req);

		// Check if the content of the paragraph is present
		if (
			!has(req.body, 'contenu') ||
			(req.body.contenu != null && req.body.contenu.length === 0)
		) {
			throw new RequestError(
				'Content cannot be null or empty',
				status.NOT_MODIFIED
			);
		}

		await checkIfUserIsWriter(req.user, paragraph);

		// Update paragraph data
		await paragraph.update({
			contenu: String(req.body.contenu),
			estVerrouille: false
		});

		res.json({
			status: true,
			message: 'Paragraph has been successfully modified'
		});
	},
	async cancelModification(req, res) {
		await checkStoryId(req);
		const paragraph = await checkParagraphId(req);
		await checkIfUserIsWriter(req.user, paragraph);

		// Remove writer status of the user
		await paragraph.setRedacteur(null);

		// Unlock paragraph
		await paragraph.update({
			estVerrouille: false
		});

		res.json({
			status: true,
			message: 'Modification canceled'
		});
	},
	async deleteParagraph(req, res) {
		const story = await checkStoryId(req);
		const paragraph = await checkParagraphId(req);

		// Check that the paragraph is not the initial paragraph
		if ((await story.getParagrapheInitial()).id === paragraph.id) {
			throw new RequestError(
				'The paragraph is the beginning of a story and thus cannot be deleted',
				status.BAD_REQUEST
			);
		}

		// Check that the paragraph does not lead to other paragraphs
		const nbChoix = await paragraph.countChoix();
		if (nbChoix > 0) {
			throw new RequestError(
				'The paragraph has choices and thus cannot be deleted',
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
