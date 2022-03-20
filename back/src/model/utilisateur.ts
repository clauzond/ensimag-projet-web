import { database } from './database';
import { DataTypes } from 'sequelize';

// Utilisateur(idUtil {pk}, pwd)
export const utilisateur = database.define(
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
