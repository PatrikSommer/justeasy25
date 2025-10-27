// Cesta: backend/src/routes/auth.routes.ts

import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import { refresh } from '../controllers/auth.refresh.controller.js';
import { me } from '../controllers/auth.me.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', requireAuth, me);

export default router;
