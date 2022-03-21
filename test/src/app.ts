import express from 'express';
import { database } from './model/database';
import { Utilisateur } from './model/utilisateur';
import { Paragraphe } from './model/paragraphe';
import { Histoire } from './model/histoire';

const PORT = 8080;
const app = express();

// Sync les models a la db
await database.sync({ force: true });
console.log('All models were synchronized successfully.');

// Tests
const clauzond = await Utilisateur.create({
	id: 'clauzondid',
	pwd: 'clauzonmdp'
});

const paragrapheclauzond = await Paragraphe.create({ contenu: 'woooow' });
const p2 = await Paragraphe.create({ contenu: 'hooo' });

const histoireClauzond = await Histoire.create({
	titre: 'Histoire de clauzond (ya des dingueries)',
	idAuteur: clauzond.get('id'),
	idParaInit: paragrapheclauzond.get('id')
});


// Retour backend
app.use((req, res) => {
	res.send("Salut clauzond, ton id c'est" + clauzond.get('id'));
});

app.listen(PORT, () => {
	console.log(`Backend up at http://localhost:${PORT}`);
});
