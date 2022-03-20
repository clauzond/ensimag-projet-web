import { DataTypes } from 'sequelize';
import { database } from './database';
import { histoire } from './histoire';
import { utilisateur } from './utilisateur';

// Collaborateur(idHist {pk, fk}, idUtil {pk, fk})
export const collaborateur = database.define(
	'Collaborateur',
	{
		idHist: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			references: {
				model: histoire,
				key: 'id'
			}
		},
		idUtil: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			references: {
				model: utilisateur,
				key: 'id'
			}
		}
	},
	{}
);
