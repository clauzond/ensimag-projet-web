import has from 'has-keys';
import { RequestError } from '../util/requestError.js';
import status from 'http-status';
import { checkStoryId } from './histoire.js';
import { Paragraphe } from '../models/index.js';

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

export const paragraphe = {
	async createParagraphe(req, res) {
		//TODO
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
