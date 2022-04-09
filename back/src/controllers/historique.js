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

		const history = await req.user.setHistorique(
			story,
			req.body.arrayParagraphe
		);
		if (history === null) {
			throw new RequestError(
				'Invalid arrayParagraphe param: one or more id are invalid',
				status.BAD_REQUEST
			);
		}

		res.json({
			status: true,
			message: 'History saved',
			history: history
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

		const history = await req.user.removeHistorique(story, paragraph);
		if (history === null) {
			throw new RequestError(
				'Paragraph is not in history',
				status.BAD_REQUEST
			);
		}

		res.json({
			status: true,
			message: 'History removed',
			history: history
		});
	},
	async clearHistory(req, res) {
		const story = await checkStoryId(req);

		const history = await req.user.clearHistorique(story);

		res.json({
			status: true,
			message: 'History cleared',
			history: history
		});
	}
};
