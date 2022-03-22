import { DataTypes } from 'sequelize';
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

Histoire.belongsTo(Utilisateur, { as: 'Auteur' }); // ajoute AuteurId dans Histoire + (get|set)Auteur
Histoire.belongsTo(Paragraphe, { as: 'ParagrapheInitial' }); // ajoute ParagrapheInitialId dans Histoire + (get|set)ParagrapheInitial
Histoire.belongsToMany(Utilisateur, { as: 'Collaborateur', through: 'CollaborateurTable' }); // ajoute (add|count|create|get|has|remove|set)Collaborateur
Utilisateur.belongsToMany(Histoire, { as: 'Histoire', through: 'CollaborateurTable' }); // ajoute table CollaborateurTable + (add|count|create|get|has|remove|set)Histoire


export { Histoire };
