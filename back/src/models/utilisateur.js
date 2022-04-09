import { DataTypes, Model } from 'sequelize';
import { database } from './database.js';
import { Historique } from './historique.js';
import { Paragraphe } from './paragraphe.js';

// Utilisateur(idUtil {pk}, pwd)
export class Utilisateur extends Model {
	// méthodes pour manipuler Historique(idUtilisateur {pk, fk}, idHistoire {pk, fk}, arrayParagraphe)
	async setHistorique(histoire, arrayParagraphe) {
		// Verify that each id exists in Paragraphe
		for (const id of arrayParagraphe) {
			if ((await Paragraphe.findByPk(id)) === null) {
				return null;
			}
		}

		await Historique.upsert({
			idUtilisateur: this.id,
			idHistoire: histoire.get('id'),
			arrayParagraphe: arrayParagraphe
		});

		return arrayParagraphe;
	}

	async getHistorique(histoire) {
		const historique = await Historique.findOne({
			where: { idUtilisateur: this.id, idHistoire: histoire.get('id') }
		});
		if (historique === null) {
			return [];
		}
		let arrayParagraphe = [];
		if (historique.arrayParagraphe.length !== 0) {
			for (const id of String(historique.arrayParagraphe).split(',')) {
				if (Number.isInteger(Number(id))) {
					arrayParagraphe.push(Number(id));
				}
			}
		}
		return arrayParagraphe;
	}

	async addHistorique(histoire, paragraphe) {
		const historique = await Historique.findOne({
			where: { idUtilisateur: this.id, idHistoire: histoire.get('id') }
		});

		let newArray;
		if (historique === null) {
			newArray = [String(paragraphe.id)];
			Historique.create({
				idUtilisateur: this.id,
				idHistoire: histoire.get('id'),
				arrayParagraphe: newArray
			});
		} else {
			if (historique.arrayParagraphe.length === 0) {
				newArray = [];
			} else {
				newArray = String(historique.arrayParagraphe).split(',');
			}
			newArray.push(paragraphe.id);
			historique.update({
				arrayParagraphe: newArray
			});
		}

		return newArray;
	}

	async removeHistorique(histoire, paragraphe) {
		const historique = await Historique.findOne({
			where: { idUtilisateur: this.id, idHistoire: histoire.get('id') }
		});
		if (historique !== null || historique.arrayParagraphe.length !== 0) {
			const newArray = [];
			let removed = false;
			for (const id of String(historique.arrayParagraphe).split(',')) {
				if (Number.isInteger(Number(id))) {
					if (Number(id) !== paragraphe.id) {
						newArray.push(Number(id));
					} else {
						removed = true;
					}
				}
			}
			if (!removed) {
				return null;
			}
			historique.update({
				arrayParagraphe: newArray
			});
			return newArray;
		} else {
			return null;
		}
	}

	async clearHistorique(histoire) {
		await Historique.update(
			{ arrayParagraphe: [] },
			{
				where: {
					idUtilisateur: this.id,
					idHistoire: histoire.get('id')
				}
			}
		);
		return [];
	}
}

Utilisateur.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false
		},
		// encrypted pwd
		pwd: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		sequelize: database
	}
);
