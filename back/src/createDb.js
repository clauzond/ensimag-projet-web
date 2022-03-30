import { database } from './models/database.js';

await database.sync({ force: true });
console.log('All models were synchronized successfully.');
