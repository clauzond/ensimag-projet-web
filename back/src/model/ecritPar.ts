import { DataTypes } from 'sequelize';
import { database } from './database';
import { utilisateur } from './utilisateur';
import { paragraphe } from './paragraphe';

// EcritPar(idUtil {pk, fk}, idPara {fk})
export const ecritPar = database.define(
	'EcritPar',
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
		idPara: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: paragraphe,
				key: 'id'
			}
		}
	},
	{}
);
