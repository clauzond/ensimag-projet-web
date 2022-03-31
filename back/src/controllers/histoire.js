import has from 'has-keys';
import { RequestError } from '../util/requestError.js';
import status from 'http-status';
import { Histoire } from '../models/index.js';

export const story = {
	async createStory(req, res) {
		if (!has(req.user, ['id'])) {
			throw new RequestError(
				'User id not found',
				status.BAD_REQUEST
			);
		}
		if (!has(req.body, 'titre')) {
			throw new RequestError(
				'Title not found',
				status.BAD_REQUEST
			);
		}

		const idAuteur = req.user.id;
		const titre = req.body.titre;
		// Par défaut, l'histoire est fermée, non publique
		const estOuverte = (has(req.body, 'estOuverte')) ? req.body.estOuverte : false;
		const estPublique = (has(req.body, 'estPublique')) ? req.body.estPublique : false;

		await Histoire.create({ titre:titre, estOuverte: estOuverte, estPublique: estPublique });


		res.json({ status: true, message: 'Returning user' });
	},

	async updateStory(req, res) {
		res.json({ status: true, message: 'Returning user' });
	},
};
