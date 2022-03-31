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
		where: { idRedacteur: idUser }
	});
	return nb === 0;
}

async function checkIfUserIsWriter(user, paragraph) {
	// Check if the current user is the writer of the paragraph
	if (paragraph.idRedacteur !== null && paragraph.idRedacteur.id !== user.id) {
		throw new RequestError(
			'You are not allowed to write on this paragraph',
			status.FORBIDDEN
		);
	}

	return true;
}

export const paragraphe = {
	async createParagraph(req, res) {
		const story = await checkStoryId(req);

		if (!has(req.body, 'titreChoix')) {
			throw new RequestError(
				'You must specified choice title',
				status.BAD_REQUEST
			);
		}

		// Check if the user is a collaborator of the story
		if (!(await story.isCollaborator(req.user))) {
			throw new RequestError('You are not allowed to create a paragraph');
		}

		// Add empty paragraphe
		const paragraph = await Paragraphe.create({
			contenu: null,
			estVerrouille: false,
			estConclusion: false
		});

		// Add choice
		const choice = await paragraph.addChoix({
			titreChoix: req.body.titreChoix,
			condition: has(req.body, 'condition') ? req.body.condition : null
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

		// TODO : ajouter à l'historique si l'utilisateur est connecté

		res.json({
			status: true,
			message: 'Returning paragraph',
			story: story,
			paragraph: paragraph
		});
	},
	async askToUpdateParagraph(req, res) {
		await checkStoryId(req);
		const paragraph = checkParagraphId(req);

		// Check if the user can write a paragraph
		if (!(await verifyUserIsFree(req.user.id))) {
			throw new RequestError(
				'You are currently write another paragraph',
				status.FORBIDDEN
			);
		}

		// Check if the paragraph is not already written by another user
		if (paragraph.estVerrouille || (paragraph.idRedacteur != null && paragraph.idRedacteur != req.user.id)) {
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
			!has(req.body, 'content') ||
			(req.body.content != null && req.body.content.length === 0)
		) {
			throw new RequestError(
				'Content cannot be null or empty',
				status.NOT_MODIFIED
			);
		}

		await checkIfUserIsWriter(req.user, paragraph);

		// Update paragraph data
		await paragraph.update({
			contenu: String(req.body.content),
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
	async deleteParagraphe(req, res) {
		await checkStoryId(req);
		const paragraphe = checkParagrapheId(req);

		// Check that the paragraph does not lead to other paragraphs
		const nbChoix = await paragraphe.countChoix();
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
			where: { ChoixId: paragraphe.id }
		});
		for (choix of arrayChoix) {
			const paragraphChoix = await Paragraphe.findOne({
				where: { id: choix.ParagrapheId }
			});
			// Update the state of paragraphChoix (it can become locked)
			await paragraphChoix.updateState();
			// Destroy the choice leading to the paragraph
			await choix.destroy();
		}

		// Remove the paragraph from the database
		await paragraphe.destroy();

		res.statusCode = status.OK;

		res.json({ status: true, message: 'Paragraph has been successfully deleted' });
	}
};
