import status from 'http-status';
import has from 'has-keys';
import bcrypt from 'bcrypt';
import jws from 'jws';
import env from 'mandatoryenv';
import { RequestError } from '../util/requestError.js';
import { Utilisateur } from '../models/index.js';

env.load(['SECRET']);
const { SECRET } = process.env;

/*
Check if utilisateur and password are formatted as expected
 */
function checkLoginFormat(req) {
	/* #swagger.responses[400] = {
			description: 'User was registered',
			schema: { $status:true, $message: 'User clauzond was registered'}
		} */

	if (!has(req.body, ['username', 'password'])) {
		throw new RequestError(
			'You must specify the username and password',
			status.BAD_REQUEST
		);
	}

	const { username, password } = req.body;

	if (username === '' || password === '') {
		throw new RequestError(
			'Username or password must not be empty',
			status.BAD_REQUEST
		);
	}

	if (password.length < 6) {
		throw new RequestError(
			'Password must be at least 6 characters',
			status.BAD_REQUEST
		);
	}
	if (password.length > 72) {
		throw new RequestError(
			'Password must be less than 72 characters',
			status.BAD_REQUEST
		);
	}
}

export const utilisateur = {
	async registerUser(req, res) {
		// #swagger.tags = ['Authentification']
		// #swagger.summary = 'Create a new user
		// #swagger.parameters['json'] = { in: 'body', description:'User and password', schema: { $username: 'clauzond', $password: 'clauzonmdp' }}
		/* #swagger.responses[400] = {
			description: 'Validation error',
			schema: { $status:false, $message: 'You must specify the username and password'}
		} */
		checkLoginFormat(req);
		const { username, password } = req.body;
		const userAlreadyExists = await Utilisateur.findByPk(username);
		if (userAlreadyExists) {
			/* #swagger.responses[304] = {
				description: 'User already exists',
				schema: { $status:true, $message: 'User clauzond is already registered'}
			} */
			throw new RequestError(
				`User ${username} is already registered`,
				status.BAD_REQUEST
			);
		}

		const hash = await bcrypt.hash(password, 10);
		await Utilisateur.create({ id: username, pwd: hash });
		res.statusCode = status.CREATED;
		/* #swagger.responses[201] = {
			description: 'User was registered',
			schema: { $status:true, $message: 'User clauzond was registered'}
		} */
		res.json({ status: true, message: `User ${username} was registered` });
	},

	async loginUser(req, res) {
		// #swagger.tags = ['Authentification']
		// #swagger.summary = 'Login with an existing user'
		// #swagger.parameters['json'] = { in: 'body', description:'User and password', schema: { $username: 'clauzond', $password: 'clauzonmdp' }}
		checkLoginFormat(req);
		const { username, password } = req.body;
		const user = await Utilisateur.findByPk(username);
		if (!user) {
			throw new RequestError(
				`Invalid username or password`,
				status.BAD_REQUEST
			);
		}

		const match = await bcrypt.compare(password, user.pwd);
		if (!match) {
			throw new RequestError(
				`Invalid username or password`,
				status.BAD_REQUEST
			);
		}

		const signature = jws.sign({
			header: { alg: 'HS256' },
			payload: JSON.stringify({ id: user.id }),
			secret: SECRET
		});

		/* #swagger.responses[200] = {
			description: 'Returning token',
			schema: { $status:true, $message: 'Returning token',
			$data:'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImNsYXV6b25kIn0.t0N93YTKjGXiDwTNlviLhyZyk0aIpGlVS1tdGGKYPbM'}
		} */
		res.json({ status: true, message: 'Returning token', data: signature });
	}
};
