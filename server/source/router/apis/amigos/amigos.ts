// EXTERNAL IMPORTS
import { Router, Request, Response } from 'express';

// SHARED IMPORTS
import { getTimestamp } from '@utils';
import { dbClient } from '@database';

export const amigosRoute = '/amigos';
export const amigosRouter = Router();

amigosRouter.get('/ping', async (_: Request, response: Response) => {
  return response.status(200).json({
    message: 'pong',
    timestamp: getTimestamp()
  });
});

amigosRouter.get('/:uuid', async (request: Request, response: Response) => {
  try {
    const queryResult = await dbClient.query(`SELECT uuid, email FROM amigos WHERE uuid = $1`, [
      request.params.uuid
    ]);

    if (queryResult.rowCount < 1) {
      return response.status(400).json({
        message: 'No amigo found with specified UUID.',
        timestamp: getTimestamp()
      });
    }

    return response.status(200).json({
      data: { amigo: { ...queryResult.rows[0] } },
      message: 'Amigo found.',
      timestamp: getTimestamp()
    });
  } catch (error) {
    return response.status(500).json({
      error,
      message: 'An error occured.',
      timestamp: getTimestamp()
    });
  }
});

amigosRouter.get('/:uuid/burros', async (request: Request, response: Response) => {
  try {
    return response.status(200).json({
      message: 'Endpoint in-progress.',
      timestamp: getTimestamp()
    });
  } catch (error) {
    return response.status(500).json({
      error,
      message: 'An error occured.',
      timestamp: getTimestamp()
    });
  }
});

amigosRouter.get('/:uuid/churros', async (request: Request, response: Response) => {
  try {
    return response.status(200).json({
      message: 'Endpoint in-progress.',
      timestamp: getTimestamp()
    });
  } catch (error) {
    return response.status(500).json({
      error,
      message: 'An error occured.',
      timestamp: getTimestamp()
    });
  }
});

amigosRouter.put('/:uuid', async (request: Request, response: Response) => {
  try {
    return response.status(200).json({
      message: 'Endpoint in-progress.',
      timestamp: getTimestamp()
    });
  } catch (error) {
    return response.status(500).json({
      error,
      message: 'An error occured.',
      timestamp: getTimestamp()
    });
  }
});

amigosRouter.delete('/:uuid', async (request: Request, response: Response) => {
  try {
    return response.status(200).json({
      message: 'Endpoint in-progress.',
      timestamp: getTimestamp()
    });
  } catch (error) {
    return response.status(500).json({
      error,
      message: 'An error occured.',
      timestamp: getTimestamp()
    });
  }
});
