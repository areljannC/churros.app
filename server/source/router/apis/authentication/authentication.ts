// EXTERNAL IMPORTS
import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

// SHARED IMPORTS
import { getTimestamp } from '../../../shared/utils';
import { dbClient } from '../../../shared/database';

export const authenticationRoute = '/authentication';
export const authenticationRouter = Router();

authenticationRouter.get('/ping', async (_: Request, response: Response) => {
  return response.status(200).json({
    message: 'pong',
    timestamp: getTimestamp()
  });
});

authenticationRouter.post('/signup', async (request: Request, response: Response) => {
  try {
    /*
      To Do:
      - password hashing
      - check if email already exists
    */
    await dbClient.query(`INSERT INTO amigos (uuid, email, password) VALUES ($1, $2, $3)`, [
      uuid(),
      request.body.email,
      request.body.password
    ]);

    return response.status(201).json({
      message: 'Succesfully created account.',
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

authenticationRouter.post('/signin', async (request: Request, response: Response) => {
  try {
    /*
      To Do:
      - JWT
      - error handling
    */
    const queryResult = await dbClient.query(
      `SELECT * FROM amigos WHERE email = $1 AND password = $2`,
      [request.body.email, request.body.password]
    );

    if (queryResult.rowCount < 1) {
      return response.status(400).json({
        message: 'Incorrect credentials.',
        timestamp: getTimestamp()
      });
    }

    return response.status(200).json({
      data: {
        jwt: 'test_jwt'
      },
      message: 'Succesful sign in.',
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
