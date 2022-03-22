import express from 'express';
import { database } from './model/database.js';
import { Utilisateur } from './model/utilisateur.js';
import { Histoire } from './model/histoire.js';
import { Paragraphe } from './model/paragraphe.js';
import { init } from './model/associations.js';

const PORT = 8080;
const app = express();

// Sync les models a la db
init();
await database.sync({ force: true });
console.log('All models were synchronized successfully.');

// Tests
const u1 = await Utilisateur.create({
	id: 'clauzond',
	pwd: 'clauzonmdp'
});
const p1 = await Paragraphe.create({ contenu: 'woooow' });
const p2 = await Paragraphe.create({ contenu: 'hooo' });
const p3 = await Paragraphe.create({ contenu: 'hooo' });
const p4 = await Paragraphe.create({ contenu: 'hooo' });
const p5 = await Paragraphe.create({ contenu: 'hooo' });

const h1 = await Histoire.create({
	titre: 'Histoire de clauzond (ya des dingueries)',
	idAuteur: u1.get('id'),
	idParaInit: p1.get('id')
});
await h1.setParagrapheInitial(p1);
await p1.addChoix(p2, { through: { titreChoix: 'hey', condititon: null } });

await u1.setHistorique(h1, [p5.id, p3.id]);
console.log("set [p5.id, p3.id]:" + (await u1.getHistorique(h1)).arrayParagraphe);
await u1.addHistorique(h1, p2);
console.log("add p2.id:" + (await u1.getHistorique(h1)).arrayParagraphe);
await u1.removeHistorique(h1, p3);
console.log("remove p3:" + (await u1.getHistorique(h1)).arrayParagraphe);
await u1.clearHistorique(h1);
console.log("clear:" + (await u1.getHistorique(h1)).arrayParagraphe);
await u1.addHistorique(h1, p4);
console.log("add p4:" + (await u1.getHistorique(h1)).arrayParagraphe);


// Retour backend
app.use((req, res) => {
	res.send("Salut clauzond, ton id c'est" + u1.get('id'));
});

app.listen(PORT, () => {
	console.log(`Backend up at http://localhost:${PORT}`);
});
