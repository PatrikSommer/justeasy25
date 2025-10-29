// Cesta: backend/src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { verifyApiKey } from './middleware/verifyApiKey.js';
import authRouter from './routes/auth.routes.js';

import healthRouter from './routes/health.routes.js';
import dbTestRouter from './routes/db-test.routes.js';
import usersRouter from './routes/users.routes.js';

export const app = express();

// základní middleware
app.disable('x-powered-by');
app.use(helmet()); // bezpečnostní hlavičky
app.use(express.json()); // práce s JSON payloadem
app.use(cookieParser()); // práce s cookies
app.use(
	cors({
		origin: ['http://localhost:3000', 'https://app.justeasy.cz'],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	})
); // povolení komunikace s FE

// API Key middleware - chrání všechny routes kromě /health a /db-test
app.use(verifyApiKey);
// routy
const prefixApi = '/api/v1';

app.use(`${prefixApi}/health`, healthRouter);
app.use(`${prefixApi}/auth`, authRouter);
app.use(`${prefixApi}/db-test`, dbTestRouter);
app.use(`${prefixApi}/users`, usersRouter);

// fallback root route
app.get('/', (_req, res) => {
	res.send('Justeasy backend is running 🚀');
});
