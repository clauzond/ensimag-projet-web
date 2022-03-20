import { DataTypes } from 'sequelize';
import { database } from './database';
import { utilisateur } from './utilisateur';
import { paragraphe } from './paragraphe';

// Histoire(idHist {pk}, estOuverte, estPublique, idAuteur {fk}, idParaInit {fk})
export const histoire = database.define(
	'Histoire',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		titre: {
			type: DataTypes.STRING,
			allowNull: false
		},
		idAuteur: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: utilisateur,
				key: 'id'
			}
		},
		idParaInit: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: paragraphe,
				key: 'id'
			}
		},
		estOuverte: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		estPublique: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	{}
);
