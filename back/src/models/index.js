import { DataTypes } from 'sequelize';
import { database } from './database.js';
import { Utilisateur } from './utilisateur.js';
import { Histoire } from './histoire.js';
import { Paragraphe } from './paragraphe.js';
import { Historique } from './historique.js';

// (get|set)Redacteur
Paragraphe.belongsTo(Utilisateur, {
	as: 'Redacteur',
	foreignKey: 'idRedacteur'
});

// (get|set)Auteur
// (get|set)ParagrapheInitial
Histoire.belongsTo(Utilisateur, { as: 'Auteur', foreignKey: 'idAuteur' });
Histoire.belongsTo(Paragraphe, {
	as: 'ParagrapheInitial',
	foreignKey: 'idParagrapheInitial'
});

// ChoixTable(titreChoix, condition, ParagrapheId {pk, fk}, ChoixId {pk, fk})
// (add|count|create|get|has|remove|set)Choix
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

// CollaborateurTable(idCollaborateur {pk, fk}, idHistoire {pk, fk})
// (add|count|create|get|has|remove|set)Collaborateur
// (add|count|create|get|has|remove|set)Histoire
Histoire.belongsToMany(Utilisateur, {
	as: 'Collaborateur',
	foreignKey: 'idCollaborateur',
	through: 'CollaborateurTable'
});
Utilisateur.belongsToMany(Histoire, {
	as: 'Histoire',
	foreignKey: 'idHistoire',
	through: 'CollaborateurTable'
});

export { Utilisateur, Histoire, Paragraphe, Historique, ChoixTable };
