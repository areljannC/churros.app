// EXTERNAL IMPORTS
import { Router } from 'express';

// LOCAL IMPORTS
import {
  authenticationRoute,
  authenticationRouter,
  amigosRoute,
  amigosRouter,
  burrosRoute,
  burrosRouter,
  churrosRoute,
  churrosRouter
} from './apis';

export const route = '/api';
export const router = Router();

router.use(authenticationRoute, authenticationRouter);
router.use(amigosRoute, amigosRouter);
router.use(burrosRoute, burrosRouter);
router.use(churrosRoute, churrosRouter);
