import has from 'has-keys';
import { RequestError } from '../util/requestError.js';
import status from 'http-status';
import { Paragraphe } from '../models/index.js';
import { checkStoryId } from './histoire.js';
import { database } from '../models/database.js';

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

export const paragraphe = {
	async createParagraph(req, res) {
		const story = checkStoryId(req);

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

		// TODO: check if the user write only one paragraphe

		// Add empty paragraphe
		const paragraph = await Paragraphe.create({
			contenu: null,
			estVerrouille: false,
			estConclusion: false
		});

		// Add choice
		const choice = await addChoix({
			titreChoix: req.body.titreChoix,
			condition: has(req.body, 'condition') ? req.body.condition : null
		});

		res.json({
			status: true,
			message: 'Paragraph created',
			paragraph: paragraph,
			choice: choice
		});
	},
	async updateParagraph(req, res) {
		//TODO
		res.json({ status: true, message: 'Returning user' });
	},
	async deleteParagraph(req, res) {
		//TODO
		res.json({ status: true, message: 'Returning user' });
	},
	async getParagraph(req, res) {
		//TODO
		res.json({ status: true, message: 'Returning user' });
	}
};
