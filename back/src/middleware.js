import { RequestError } from './util/requestError.js';
import { Utilisateur } from './models/index.js';
import jws from 'jws';
import status from 'http-status';
import env from 'mandatoryenv';

env.load(['SECRET']);
const { SECRET } = process.env;

/**
 * Middleware that verifies if the user is logged in.
 * The token must be passed via the x-access-token header
 */
export async function auth(req, res, next) {
	const token = req.get('x-access-token');
	if (token == null) {
		throw new RequestError(
			'You must specify your access token in the "x-access-token" header',
			status.BAD_REQUEST
		);
	}

	if (!jws.verify(token, 'HS256', SECRET)) {
		throw new RequestError('Invalid token', status.BAD_REQUEST);
	}

	const id = JSON.parse(jws.decode(token).payload).id;

	const user = await Utilisateur.findOne({ where: { id } });
	if (user == null) {
		throw new RequestError(
			'User specified in token not found',
			status.NOT_FOUND
		);
	}

	req.user = user;

	next();
}
