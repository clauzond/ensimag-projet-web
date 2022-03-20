import express from 'express';
import { database } from './model/database';
import { utilisateur } from './model/utilisateur';
import { paragraphe } from './model/paragraphe';
import { histoire } from './model/histoire';
import { historique } from './model/historique';

const PORT = 8080;
const app = express();

// Sync les models a la db
await database.sync({ force: true });
console.log('All models were synchronized successfully.');

// Tests
const clauzond = await utilisateur.create({
	id: 'clauzondid',
	pwd: 'clauzonmdp'
});
const paragrapheclauzond = await paragraphe.create({ contenu: 'woooow' });
const p2 = await paragraphe.create({ contenu: 'hooo' });

const histoireClauzond = await histoire.create({
	titre: 'Histoire de clauzond (ya des dingueries)',
	idAuteur: clauzond.get('id'),
	idParaInit: paragrapheclauzond.get('id')
});
const histoClauzond = await historique.create({
	idUtil: clauzond.get('id'),
	idHist: histoireClauzond.get('id'),
	arrayPara: [p2.get('id'), paragrapheclauzond.get('id')]
});

// Retour backend
app.use((req, res) => {
	res.send(
		"Salut clauzond, ton id c'est" +
			clauzond.get('id') +
			" et ton historique c'est" +
			histoClauzond.get('idPara')
	);
});

app.listen(PORT, () => {
	console.log(`Backend up at http://localhost:${PORT}`);
});
