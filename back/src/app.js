import express from 'express';
import 'express-async-errors';
import { router } from './routes/router.js';

const app = express();

// Configure Express App Instance
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Assign Routes
app.use('/', router);

// Error handling middleware
app.use((err, req, res, next) => {
	res.status(err.code ?? 400).json({
		status: false,
		message: err.message
	});
	next();
});

export { app };
