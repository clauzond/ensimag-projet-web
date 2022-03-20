import { Sequelize } from 'sequelize';
import path from 'path';

export const database = new Sequelize({
	dialect: 'sqlite',
	storage: path.join(path.dirname(''), 'sqlite.db'),
	define: {
		timestamps: false,
		freezeTableName: true
	}
});
