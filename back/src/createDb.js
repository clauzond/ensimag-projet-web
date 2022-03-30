import { database } from './models/database.js';

database.sync({ force: true });
console.log('All models were synchronized successfully.');
