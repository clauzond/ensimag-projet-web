import path from 'path';
import { Sequelize } from 'sequelize';

const database = new Sequelize({
	dialect: 'sqlite',
	storage: path.join(path.dirname(''), 'sqlite.db'),
	define: {
		timestamps: false,
		freezeTableName: true
	}
});

export { database };