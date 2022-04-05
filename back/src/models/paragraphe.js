import { DataTypes, Model } from 'sequelize';
import { database } from './database.js';

// Paragraphe(id {pk}, contenu, estVerrouille, estConclusion, redacteurId {fk})
export class Paragraphe extends Model {
	/**
	 * Returns true iff user is the redactor of the paragraph
	 * @param {*} utilisateur
	 * @returns boolean
	 */
	async isRedacteur(utilisateur) {
		const redacteur = await this.getRedacteur();
		if (redacteur === null) {
			return false;
		}
		return redacteur.id === utilisateur.id;
	}

	/**
	 * Returns true iff paragraph is a conclusion or has choice with no condition
	 * @returns boolean
	 */
	async hasPossibleChoix() {
		if (this.estConclusion) {
			return true;
		}
		const nb = await this.countChoix({ where: 'condition = NULL' });
		return nb > 0;
	}

	/**
	 * If the paragraph does not have possible choice, lock itself
	 */
	async updateState() {
		if (!this.hasPossibleChoix) {
			this.set('estVerrouille', true);
		}
	}

	/**
	 * Returns true iff paragraph can lead to a conclusion
	 * Complexity of O(n) where n is the number paragraph of the story
	 * @returns boolean
	 */
	async leadToConclusion() {
		const toVisit = await this.getChoix();
		const alreadySeen = [];

		// Breadth-first search
		while (toVisit.length > 0) {
			const choice = toVisit.pop();
			if (choice.estConclusion) {
				return true;
			}
			if (alreadySeen.includes(choice.id)) {
				continue;
			}
			alreadySeen.push(choice);
			toVisit.push(...(await choice.getChoix()));
		}
		return false;
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
