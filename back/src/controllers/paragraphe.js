import has from 'has-keys';
import { RequestError } from '../util/requestError.js';
import status from 'http-status';
import { Paragraphe } from '../models/index.js';
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
		//TODO
		res.json({ status: true, message: 'Returning user' });
	},
	async getParagraphe(req, res) {
		//TODO
		res.json({ status: true, message: 'Returning user' });
	}
};
