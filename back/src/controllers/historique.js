import has from 'has-keys';
import { RequestError } from '../util/requestError.js';
import status from 'http-status';
import { checkStoryId } from './histoire.js';

export const history = {
    async saveHistory(req, res) {
        const story = await checkStoryId(req);

        if (!has(req.body, 'arrayParagraphe')) {
			throw new RequestError('You must specify arrayParagraphe param', status.BAD_REQUEST);
		}
	
        await req.user.setHistorique(story, req.body.arrayParagraphe);

        res.json({
			status: true,
			message: 'History saved',
		});
    }
}