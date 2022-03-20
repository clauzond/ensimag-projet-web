import { DataTypes } from 'sequelize';
import { database } from './database';
import { utilisateur } from './utilisateur';
import { histoire } from './histoire';

// Historique(idUtil {pk, fk}, idHist {pk, fk}, arrayPara)
export const historique = database.define(
	'Historique',
	{
		idUtil: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			references: {
				model: utilisateur,
				key: 'id'
			}
		},
		idHist: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			references: {
				model: histoire,
				key: 'id'
			}
		},
		arrayPara: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
			primaryKey: true,
			allowNull: false
		}
	},
	{}
);
