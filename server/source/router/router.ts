// EXTERNAL IMPORTS
import { Router } from 'express';

// LOCAL IMPORTS
import { authenticationRoute, authenticationRouter } from './apis';

export const route = '/api';
export const router = Router();

router.use(authenticationRoute, authenticationRouter);
