import has from 'has-keys';
import { RequestError } from '../util/requestError.js';
import status from 'http-status';
import { Histoire, Paragraphe } from '../models/index.js';

export const story = {
	async createStory(req, res) {
		if (!has(req.body, 'titre')) {
			throw new RequestError('Title not found', status.BAD_REQUEST);
		}

		// Par défaut, l'histoire est fermée, non publique
		const utilisateur = req.user;
		const titre = req.body.titre;
		const estOuverte = has(req.body, 'estOuverte')
			? req.body.estOuverte
			: false;
		const estPublique = has(req.body, 'estPublique')
			? req.body.estPublique
			: false;

		// Création de l'histoire
		const histoire = await Histoire.create({
			titre: titre,
			estOuverte: estOuverte,
			estPublique: estPublique
		});

		// Ajout de l'utilisateur en tant qu'auteur
		await histoire.setAuteur(utilisateur);

		// Ajout de l'utilisateur dans les collaborateurs
		await histoire.addCollaborateur(utilisateur);

		// Création du paragraphe initial
		const paragrapheInitial = await Paragraphe.create({
			contenu: null,
			estVerrouille: true,
			estConclusion: false
		});

		// Ajout du paragraphe initial à l'histoire
		await histoire.setParagrapheInitial(paragrapheInitial);

		res.json({
			status: true,
			message: 'Story created! Returning story and initial paragraph',
			histoire: histoire,
			paragrapheInitial: paragrapheInitial
		});
	},
	async updateStory(req, res) {
		// Get story

		res.json({ status: true, message: 'Returning user' });
	},
	async getStory(req, res) {
		//TODO
		res.json({ status: true, message: 'Returning user' });
	}
};
