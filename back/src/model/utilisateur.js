import { DataTypes } from 'sequelize';
import { database } from './database.js';

// Utilisateur(idUtil {pk}, pwd)
const Utilisateur = database.define(
	'Utilisateur',
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false
		},
		pwd: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{}
);

export { Utilisateur };
