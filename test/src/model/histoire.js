import { DataTypes, HasOne } from 'sequelize';
import { database } from './database';
import { Utilisateur } from './utilisateur.js';
import { Paragraphe } from './paragraphe.js';

// Histoire(idHist {pk}, estOuverte, estPublique, idAuteur {fk}, idParaInit {fk})
const Histoire = database.define(
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

Histoire.belongsTo(Utilisateur, { as: 'Auteur' });
Histoire.belongsTo(Paragraphe, { as: 'ParagrapheInitial' });
Histoire.belongsToMany(Utilisateur, { through: 'Collaborateur' });
Utilisateur.belongsToMany(Histoire, { through: 'Collaborateur' });

export { Histoire };
