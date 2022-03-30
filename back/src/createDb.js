import { database } from './models/database.js';
import * as allModels from './models/index.js';

await database.sync({ force: true });
console.log('All models were synchronized successfully.');
