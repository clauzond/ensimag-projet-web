import { load } from 'mandatoryenv';
import { app } from './app.js';

// Import PORT from .env
const { PORT } = load(['PORT']);

// Open Server on selected Port
app.listen(PORT, () => {
	console.log(`Backend up at http://localhost:${PORT}`);
});
