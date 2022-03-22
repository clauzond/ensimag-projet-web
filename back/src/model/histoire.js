import { DataTypes } from 'sequelize';
import { database } from './database.js';
import { Utilisateur } from './utilisateur.js';
import { Paragraphe } from './paragraphe.js';

// Histoire(id {pk}, estOuverte, estPublique, idAuteur {fk}, idParagrapheInitial {fk})
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

Histoire.belongsTo(Utilisateur, { as: 'Auteur', foreignKey: 'idAuteur'}); // ajoute idAuteur dans Histoire + (get|set)Auteur
Histoire.belongsTo(Paragraphe, { as: 'ParagrapheInitial', foreignKey: 'idParagrapheInitial' }); // ajoute idParagrapheInitial dans Histoire + (get|set)ParagrapheInitial

// CollaborateurTable(idCollaborateur {pk, fk}, idHistoire {pk, fk})
Histoire.belongsToMany(Utilisateur, { as: 'Collaborateur', foreignKey: 'idCollaborateur', through: 'CollaborateurTable' }); // ajoute (add|count|create|get|has|remove|set)Collaborateur
Utilisateur.belongsToMany(Histoire, { as: 'Histoire', foreignKey: 'idHistoire', through: 'CollaborateurTable' }); // ajoute table CollaborateurTable + (add|count|create|get|has|remove|set)Histoire


export { Histoire };
