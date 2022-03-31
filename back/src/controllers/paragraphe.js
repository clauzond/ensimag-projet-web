import has from 'has-keys';
import { RequestError } from '../util/requestError.js';
import status from 'http-status';
import { Paragraphe, ChoixTable } from '../models/index.js';
import { checkStoryId } from './histoire.js';

async function checkParagrapheId(req) {
	if (!has(req.params, 'idParagraphe')) {
		throw new RequestError(
			'You must specified paragraphe id',
			status.BAD_REQUEST
		);
	}

	const paragrapheId = req.params.idParagraphe;

	// Get paragraphe object
	const paragraphe = await Paragraphe.findByPk(paragrapheId);
	if (!paragraphe) {
		throw new RequestError(
			"The paragraphe doesn't exist",
			status.NOT_FOUND
		);
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
	async createParagraphe(req, res) {
		const story = checkStoryId();

		// Check if the user is a collaborator of the story
		if (!(await story.isCollaborator(req.user))) {
			throw new RequestError(
				'You are not allowed to create a paragraphe'
			);
		}

		res.json({ status: true, message: 'Returning user' });
	},
	async updateParagraphe(req, res) {
		//TODO
		res.json({ status: true, message: 'Returning user' });
	},
	async deleteParagraphe(req, res) {
		const paragraphe = checkParagrapheId(req);

		// Check that the paragraph does not lead to other paragraphs
		const nbChoix = await paragraphe.countChoix();
		if (nbChoix > 0) {
			throw new RequestError(
				"The paragraph has choices and thus cannot be deleted",
				status.BAD_REQUEST
			);
		}

		// For every paragraph which has this one as a choice,
		// remove the choice and update its state to locked
		// if it becomes invalid
		const arrayChoix = await ChoixTable.findAll({ where: { ChoixId: paragraphe.id }});
		for (choix of arrayChoix) {
			choix
		}


		res.json({ status: true, message: 'Returning user' });
	},
	async getParagraphe(req, res) {
		//TODO
		res.json({ status: true, message: 'Returning user' });
	}
};
