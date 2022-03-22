import { DataTypes } from 'sequelize';
import { database } from './database.js';
import { Utilisateur } from './utilisateur.js';
import { Histoire } from './histoire.js';

// Historique(idUtilisateur {pk, fk}, idHistoire {pk, fk}, arrayParagraphe)
const Historique = database.define(
	'Historique',
	{
		idUtilisateur: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
			references: {
				model: Utilisateur,
				key: 'id'
			}
		},
		idHistoire: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			references: {
				model: Histoire,
				key: 'id'
			}
		},
		arrayParagraphe: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
			allowNull: false
		}
	},
	{}
);

export { Historique };
