import { DataTypes } from 'sequelize';
import { database } from './database.js';
import { Utilisateur } from './utilisateur.js';

// Paragraphe(id {pk}, contenu, estVerrouille, estConclusion, redacteurId {fk})
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

Paragraphe.belongsTo(Utilisateur, { as: 'Redacteur', foreignKey: 'idRedacteur', }); // ajoute (get|set)Redacteur

// ChoixTable(titreChoix, condition, ParagrapheId {pk, fk}, ChoixId {pk, fk})
Paragraphe.belongsToMany(Paragraphe, { as: 'Choix', through: ChoixTable }); // ajoute table ChoixTable + (add|count|create|get|has|remove|set)Choix

export { Paragraphe };
