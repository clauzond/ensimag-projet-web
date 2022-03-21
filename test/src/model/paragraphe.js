import { DataTypes } from 'sequelize';
import { database } from './database';
import { Utilisateur } from './utilisateur.js';

// Paragraphe(idPara {pk}, contenu, estVerrouille, estConclusion)
const Paragraphe = database.define(
	'Paragraphe',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		contenu: {
			type: DataTypes.STRING,
			allowNull: true
		},
		estVerrouille: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		estConclusion: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	{}
);

const ChoixTable = database.define('ChoixTable', {
	titreChoix: {
		type: DataTypes.STRING,
		allowNull: false
	},
	condition: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: {
			model: Paragraphe,
			key: 'id'
		}
	}
});

Paragraphe.belongsToMany(Paragraphe, { as: 'Choix', through: ChoixTable });
Paragraphe.belongsTo(Utilisateur, { as: 'Redacteur' });

export { Paragraphe };
