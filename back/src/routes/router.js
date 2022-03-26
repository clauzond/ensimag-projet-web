import express from 'express';
import login from './login.js';
const router = express.Router();

router.use(story);
router.use(login);
router.use(function (req, res, next) {
	res.send(`
	Si ca marche pas faite npm run create-db  <br>
	Creer un utilisateur: POST /api/register<br>
	{ "username": "clauzond", "password": "clauzonmdp" }<br>
	Se connecter: POST /api/login<br>
	{ "username": "clauzond", "password": "clauzonmdp" }<br>
	Renvoie le token jwt<br>
	`);
	next();
});

export { router };
