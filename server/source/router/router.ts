// EXTERNAL IMPORTS
import { Router } from 'express';

// LOCAL IMPORTS
import { authenticationRoute, authenticationRouter, burrosRoute, burrosRouter } from './apis';

export const route = '/api';
export const router = Router();

router.use(authenticationRoute, authenticationRouter);
router.use(burrosRoute, burrosRouter);
