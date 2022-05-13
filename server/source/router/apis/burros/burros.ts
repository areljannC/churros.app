// EXTERNAL IMPORTS
import { Router, Request, Response } from 'express';

export const burrosRoute = '/burros';
export const burrosRouter = Router();

burrosRouter.get('/ping', (_: Request, response: Response) => {
  response.send('pong');
});

burrosRouter.get('/', (request: Request, response: Response) => {
  // TO DO
  response.send('get burros');
});

burrosRouter.get('/:uuid', (request: Request, response: Response) => {
  // TO DO
  response.send(`get burro ${request.params.uuid}`);
});

burrosRouter.post('/', (request: Request, response: Response) => {
  // TO DO
  response.send('create burro');
});

burrosRouter.put('/:uuid', (request: Request, response: Response) => {
  // TO DO
  response.send(`update burro ${request.params.uuid}`);
});

burrosRouter.delete('/:uuid', (request: Request, response: Response) => {
  // TO DO
  response.send(`delete burro ${request.params.uuid}`);
});

burrosRouter.get('/:uuid/churros', (request: Request, response: Response) => {
  // TO DO
  response.send(`get churros of burro ${request.params.uuid}`);
});
