import { DataTypes } from 'sequelize';
import { database } from './database.js';

// Paragraphe(id {pk}, contenu, estVerrouille, estConclusion, redacteurId {fk})
const Paragraphe = database.define(
	'Paragraphe',
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
	{}
);

export { Paragraphe };
