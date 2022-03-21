import { database } from './database';
import { DataTypes } from 'sequelize';

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
