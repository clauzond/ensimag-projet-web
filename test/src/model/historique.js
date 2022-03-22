import { DataTypes } from 'sequelize';
import { database } from './database.js';
import { utilisateur } from './utilisateur.js';
import { histoire } from './histoire.js';

// Historique(idUtilisateur {pk, fk}, idHistoire {pk, fk}, arrayParagraphe)
export const historique = database.define(
	'Historique',
	{
		idUtilisateur: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			references: {
				model: utilisateur,
				key: 'id'
			}
		},
		idHistoire: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			references: {
				model: histoire,
				key: 'id'
			}
		},
		arrayParagraphe: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
			primaryKey: true,
			allowNull: false
		}
	},
	{}
);
