// EXTERNAL IMPORTS
import { Router, Request, Response } from 'express';

export const authenticationRoute = '/authentication';
export const authenticationRouter = Router();

authenticationRouter.get('/ping', (_: Request, response: Response) => {
  response.send('pong');
});

authenticationRouter.post('/signup', (request: Request, response: Response) => {
  // TO DO
  response.send('signup');
});

authenticationRouter.post('/signin', (request: Request, response: Response) => {
  // TO DO
  response.send('signin');
});
