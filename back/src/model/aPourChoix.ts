import { DataTypes } from 'sequelize';
import { database } from './database';
import { paragraphe } from './paragraphe';

// APourChoix(idPara {pk, fk}, idChoix {fk}, titreChoix, condition)
export const aPourChoix = database.define(
	'APourChoix',
	{
		idPara: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			references: {
				model: paragraphe,
				key: 'id'
			}
		},
		idChoix: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: paragraphe,
				key: 'id'
			}
		},
		titreChoix: {
			type: DataTypes.STRING,
			allowNull: false
		},
		condition: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: paragraphe,
				key: 'id'
			}
		}
	},
	{}
);
