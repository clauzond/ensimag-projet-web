import { DataTypes, Model } from 'sequelize';
import { database } from './database.js';
import { Historique } from './historique.js';
import { Paragraphe } from './paragraphe.js';

// Utilisateur(idUtil {pk}, pwd)
export class Utilisateur extends Model {
	// méthodes pour manipuler Historique(idUtilisateur {pk, fk}, idHistoire {pk, fk}, arrayParagraphe)
	async setHistorique(histoire, arrayParagraphe) {
		// Verify that each id exists in Paragraphe
		for (const obj of arrayParagraphe) {
			if ((await Paragraphe.findByPk(obj.id)) === null) {
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
		return historique.arrayParagraphe;
	}

	async addHistorique(histoire, idParagraphe, titreParagraphe) {
		const historique = await Historique.findOne({
			where: { idUtilisateur: this.id, idHistoire: histoire.get('id') }
		});

		let newArray;
		if (historique === null) {
			newArray = [{ id: idParagraphe, title: titreParagraphe }];
			await Historique.create({
				idUtilisateur: this.id,
				idHistoire: histoire.get('id'),
				arrayParagraphe: newArray
			});
		} else {
			newArray = historique.arrayParagraphe.slice();
			newArray.push({ id: idParagraphe, title: titreParagraphe });
			await historique.update({
				arrayParagraphe: newArray
			});
		}

		return newArray;
	}

	async removeHistorique(histoire, idParagraphe) {
		const historique = await Historique.findOne({
			where: { idUtilisateur: this.id, idHistoire: histoire.get('id') }
		});
		if (historique !== null || historique.arrayParagraphe.length !== 0) {
			const newArray = [];
			let removed = false;
			for (const obj of historique.arrayParagraphe) {
				if (obj.id !== idParagraphe) {
					newArray.push(obj);
				} else {
					removed = true;
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
