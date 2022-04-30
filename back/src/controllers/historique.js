import has from 'has-keys';
import { RequestError } from '../util/requestError.js';
import status from 'http-status';
import { checkStoryId } from './histoire.js';
import { checkParagraphId } from './paragraphe.js';

export const history = {
	async saveHistory(req, res) {
		// #swagger.tags = ['History']
		// #swagger.summary = Save current history
		/* #swagger.parameters['json'] = { in: 'body',
		schema: {
			$arrayParagraphe: [3, 4, 12],
		}}
		 */

		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
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
		// #swagger.tags = ['History']
		// #swagger.summary = Get the history for a story
		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		const story = await checkStoryId(req);

		const history = await req.user.getHistorique(story);

		res.json({
			status: true,
			message: 'Returning history',
			history: history
		});
	},
	async removeHistory(req, res) {
		// #swagger.tags = ['History']
		// #swagger.summary = Delete a paragraph from history
		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		const story = await checkStoryId(req);
		const paragraph = await checkParagraphId(req);

		const history = await req.user.removeHistorique(story, paragraph.id);
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
		// #swagger.tags = ['History']
		// #swagger.summary = Delete history for a story
		/* #swagger.responses[400] = {
      description: 'Validation error',
    } */
		const story = await checkStoryId(req);

		const history = await req.user.clearHistorique(story);

		res.json({
			status: true,
			message: 'History cleared',
			history: history
		});
	}
};
