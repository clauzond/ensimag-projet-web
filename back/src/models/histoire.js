import { DataTypes, Model } from 'sequelize';
import { database } from './database.js';

// Histoire(id {pk}, estOuverte, estPublique, idAuteur {fk}, idParagrapheInitial {fk})
export class Histoire extends Model {}

Histoire.init(
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
	{
		sequelize: database
	}
);
