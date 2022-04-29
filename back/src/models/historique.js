import { DataTypes, Model } from 'sequelize';
import { database } from './database.js';
import { Utilisateur } from './utilisateur.js';
import { Histoire } from './histoire.js';

// Historique(idUtilisateur {pk, fk}, idHistoire {pk, fk}, arrayParagraphe)
export class Historique extends Model {}

Historique.init(
	{
		idUtilisateur: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
			references: {
				model: 'Utilisateur',
				key: 'id'
			}
		},
		idHistoire: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			references: {
				model: 'Histoire',
				key: 'id'
			}
		},
		arrayParagraphe: {
			// [..., {id: int, title: String}]
			type: DataTypes.JSON,
			allowNull: false
		}
	},
	{
		sequelize: database
	}
);
