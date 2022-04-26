import express from 'express';
import bodyParser from 'express/'
import 'express-async-errors';
import { router } from './routes/router.js';
import { RequestError } from './util/requestError.js'

const app = express();

// Configure Express App Instance
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Assign Routes
app.use('/', router);

// Return error as json
app.use(express.json());
// Error handling middleware
app.use((err, req, res, next) => {
	console.log("got error", err);
	if (err instanceof RequestError) {
		res.status(err.code ?? 400).send({
			status: false,
			message: err.message
		});
	} else {
		res.status(400).send({
			status: false,
			message: err.message ?? "Internal server error"
		})
	}
});

export { app };
