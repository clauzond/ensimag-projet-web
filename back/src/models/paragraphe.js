import { DataTypes, Model } from 'sequelize';
import { database } from './database.js';

// Paragraphe(id {pk}, contenu, estVerrouille, estConclusion, redacteurId {fk})
export class Paragraphe extends Model {
	async isAuthor(utilisateur) {
		const redacteur = await this.getRedacteur();
		if (redacteur === null) {
			return false;
		}
		return redacteur.id === utilisateur.id;
	}

	async hasPossibleChoix() {
		if (this.estConclusion) {
			return true;
		}
		const nb = await this.countChoix({ where: 'condition = NULL' });
		return nb > 0;
	}
}

Paragraphe.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		contenu: {
			type: DataTypes.STRING,
			allowNull: true
		},
		estVerrouille: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		estConclusion: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	{
		sequelize: database
	}
);
