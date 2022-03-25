import express from 'express';
import 'express-async-errors';
import { router } from './routes/router.js';

// await database.sync({ force: true });
// console.log('All models were synchronized successfully.');

const app = express();

// Configure Express App Instance
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Tests
// const u1 = await Utilisateur.create({
// 	id: 'clauzond',
// 	pwd: 'clauzonmdp'
// });
// const p1 = await Paragraphe.create({ contenu: 'woooow' });
// const p2 = await Paragraphe.create({ contenu: 'hooo' });
// const p3 = await Paragraphe.create({ contenu: 'hooo' });
// const p4 = await Paragraphe.create({ contenu: 'hooo' });
// const p5 = await Paragraphe.create({ contenu: 'hooo' });
//
// const h1 = await Histoire.create({
// 	titre: 'Histoire de clauzond (ya des dingueries)',
// 	idAuteur: u1.get('id'),
// 	idParaInit: p1.get('id')
// });
// await h1.setParagrapheInitial(p1);
// await p1.addChoix(p2, { through: { titreChoix: 'hey', condititon: null } });
//
// await u1
// 	.setHistorique(h1, [p5.id, p3.id])
// 	.then(u => u.getHistorique(h1))
// 	.then(h => console.log('set [p5.id, p3.id]: ' + h.arrayParagraphe));
// await u1
// 	.addHistorique(h1, p2)
// 	.then(u => u.getHistorique(h1))
// 	.then(h => console.log('add p2: ' + h.arrayParagraphe));
// await u1
// 	.removeHistorique(h1, p3)
// 	.then(u => u.getHistorique(h1))
// 	.then(h => console.log('remove p3: ' + h.arrayParagraphe));
// await u1
// 	.clearHistorique(h1)
// 	.then(u => u.getHistorique(h1))
// 	.then(h => console.log('clear: ' + h.arrayParagraphe));
// await u1
// 	.addHistorique(h1, p4)
// 	.then(u => u.getHistorique(h1))
// 	.then(h => console.log('add p4: ' + h.arrayParagraphe));
// await u1
// 	.addHistorique(h1, p1)
// 	.then(u => u.getHistorique(h1))
// 	.then(h => console.log('add p1: ' + h.arrayParagraphe));

// Assign Routes
app.use('/', router);

// This middleware adds the json header to every response
app.use('*', (req, res, next) => {
	res.setHeader('Content-Type', 'application/json');
	next();
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.log('Error Handling Middleware called');

	res.status(err.code ?? 400).json({
		status: false,
		message: err.message
	});
	next();
});

export { app };
