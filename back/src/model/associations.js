import { DataTypes } from 'sequelize';
import { database } from './database.js';
import { Utilisateur } from './utilisateur.js';
import { Histoire } from './histoire.js';
import { Paragraphe } from './paragraphe.js';
import { Historique } from './historique.js';

export const init = () => {
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

	// méthodes pour manipuler Historique(idUtilisateur {pk, fk}, idHistoire {pk, fk}, arrayParagraphe)
	Utilisateur.prototype.setHistorique = async function (
		histoire,
		arrayParagraphe
	) {
		await Historique.upsert({
			idUtilisateur: this.id,
			idHistoire: histoire.get('id'),
			arrayParagraphe: arrayParagraphe
		});
	};

	Utilisateur.prototype.getHistorique = async function (histoire) {
		return await Historique.findOne({
			where: { idUtilisateur: this.id, idHistoire: histoire.get('id') }
		});
	};

	Utilisateur.prototype.addHistorique = async function (
		histoire,
		paragraphe
	) {
		await Historique.findOne({
			where: { idUtilisateur: this.id, idHistoire: histoire.get('id') }
		}).then(historique => {
			if (historique === null) {
				Historique.create({
					idUtilisateur: this.id,
					idHistoire: histoire.get('id'),
					arrayParagraphe: [paragraphe.id]
				});
			} else {
				let newArray;
				if (historique.arrayParagraphe.length === 0) {
					newArray = [];
				} else {
					newArray = historique.arrayParagraphe.split(',');
				}
				newArray.push(paragraphe.id);
				historique.update({
					arrayParagraphe: newArray
				});
			}
		});
	};

	Utilisateur.prototype.removeHistorique = async function (
		histoire,
		paragraphe
	) {
		await Historique.findOne({
			where: { idUtilisateur: this.id, idHistoire: histoire.get('id') }
		}).then(historique => {
			if (historique !== null) {
				const newArray = historique.arrayParagraphe
					.split(',')
					.filter(id => id !== paragraphe.id);
				historique.update({
					arrayParagraphe: newArray
				});
			}
		});
	};

	Utilisateur.prototype.clearHistorique = async function (histoire) {
		await Historique.update(
			{ arrayParagraphe: [] },
			{
				where: {
					idUtilisateur: this.id,
					idHistoire: histoire.get('id')
				}
			}
		);
	};
};
