import { DataTypes, Model } from 'sequelize';
import { database } from './database.js';
import { Historique } from './historique.js';

// Utilisateur(idUtil {pk}, pwd)
export class Utilisateur extends Model {
	// méthodes pour manipuler Historique(idUtilisateur {pk, fk}, idHistoire {pk, fk}, arrayParagraphe)
	async setHistorique(histoire, arrayParagraphe) {
		await Historique.upsert({
			idUtilisateur: this.id,
			idHistoire: histoire.get('id'),
			arrayParagraphe: arrayParagraphe
		});
		return this;
	}

	async getHistorique(histoire) {
		return await Historique.findOne({
			where: { idUtilisateur: this.id, idHistoire: histoire.get('id') }
		});
	}

	async addHistorique(histoire, paragraphe) {
		await Historique.findOne({
			where: { idUtilisateur: this.id, idHistoire: histoire.get('id') }
		}).then(historique => {
			if (historique === null) {
				Historique.create({
					idUtilisateur: this.id,
					idHistoire: histoire.get('id'),
					arrayParagraphe: [String(paragraphe.id)]
				});
			} else {
				let newArray;
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
		});
		return this;
	}

	async removeHistorique(histoire, paragraphe) {
		await Historique.findOne({
			where: { idUtilisateur: this.id, idHistoire: histoire.get('id') }
		}).then(historique => {
			if (historique !== null) {
				const newArray = historique.arrayParagraphe
					.split(',')
					.filter(id => id !== paragraphe.id);
				historique.update({
					arrayParagraphe: newArray
				});
			}
		});
		return this;
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
		return this;
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
