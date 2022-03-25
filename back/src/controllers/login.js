import status from 'http-status';
import has from 'has-keys';
import bcrypt from 'bcrypt';
import jws from 'jws';
import env from 'mandatoryenv';
import { RequestError } from '../util/requestError.js';
import { Utilisateur } from '../models/index.js';

env.load(['SECRET']);
const { SECRET } = process.env;

export const login = {
	async registerUser(req, res) {
		if (!has(req.body, ['username', 'password'])) {
			throw new RequestError(
				'You must specify the username and password',
				status.BAD_REQUEST
			);
		}

		const { username, password } = req.body;
		if (username === '' || password === ``) {
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

		const userAlreadyExists = await Utilisateur.findByPk(username);
		if (userAlreadyExists) {
			throw new RequestError(
				`User ${username} is already registered`,
				status.BAD_REQUEST
			);
		}

		const hash = await bcrypt.hash(password, 10);
		await Utilisateur.create({ id: username, pwd: hash });
		res.json({ status: true, message: `User ${username} was registered` });
	},

	async login(req, res) {
		if (!has(req.body, ['username', 'password'])) {
			throw new RequestError(
				'You must specify the username and password',
				status.BAD_REQUEST
			);
		}

		const { username, password } = req.body;
		if (username === '' || password === ``) {
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
			payload: JSON.stringify({ username: user.id }),
			secret: SECRET
		});

		res.json({ status: true, message: 'Returning token', signature });
	}
};
