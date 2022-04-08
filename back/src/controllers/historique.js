import has from 'has-keys';
import { RequestError } from '../util/requestError.js';
import status from 'http-status';
import { checkStoryId } from './histoire.js';
import { checkParagraphId } from './paragraphe.js';

export const history = {
	async saveHistory(req, res) {
		const story = await checkStoryId(req);

		if (!has(req.body, 'arrayParagraphe')) {
			throw new RequestError(
				'You must specify arrayParagraphe param',
				status.BAD_REQUEST
			);
		}

		await req.user.setHistorique(story, req.body.arrayParagraphe);

		res.json({
			status: true,
			message: 'History saved'
		});
	},
	async getHistory(req, res) {
		const story = await checkStoryId(req);

		const history = await req.user.getHistorique(story);

		res.json({
			status: true,
			message: 'Returning history',
			history: history
		});
	},
	async removeHistory(req, res) {
		const story = await checkStoryId(req);
		const paragraph = await checkParagraphId(req);

		await req.user.removeHistorique(story, paragraph);

		res.json({
			status: true,
			message: 'History removed'
		});
	},
	async clearHistory(req, res) {
		const story = await checkStoryId(req);

		await req.user.clearHistorique(story);

		res.json({
			status: true,
			message: 'History cleared'
		});
	}
};
