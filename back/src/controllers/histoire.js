import has from 'has-keys';
import { RequestError } from '../util/requestError.js';
import status from 'http-status';

export const story = {
	async createStory(req, res) {
		res.json({ status: true, message: 'Returning user' });
	}
};
