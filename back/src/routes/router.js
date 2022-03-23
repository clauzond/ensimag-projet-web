import express from 'express';
const router = express.Router();

// TODO: call 'histoire' route
router.use(function (req, res, next) {
	console.log('Bravo tu es sur le router bg');
	next();
});

export { router };
