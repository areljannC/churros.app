// EXTERNAL IMPORTS
import { Router, Request, Response } from 'express';
import { QueryResult } from 'pg';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// SHARED IMPORTS
import { privateKey, publicKey } from '@constants';
import { getTimestamp } from '@utils';
import { dbClient } from '@database';

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
    const { email, password, name } = request.body;
    let queryResult: QueryResult;

    // Check if email is already in use.
    queryResult = await dbClient.query(
      'SELECT email FROM amigos WHERE email = $1 AND is_deleted = FALSE',
      [email]
    );

    // Return `400` if email is already in use.
    if (queryResult.rowCount > 0) {
      return response.status(400).json({
        message: 'Email is already in use.',
        timestamp: getTimestamp()
      });
    }

    // Hash the password asynchronously so it doesn't block the event loop.
    const hashedPassword = await new Promise((resolve, _) => {
      bcrypt.hash(password, 10, (error, hash) => {
        if (error) throw error;
        resolve(hash);
      });
    });

    // Insert user info to database.
    queryResult = await dbClient.query(
      'INSERT INTO amigos (uuid, email, name) VALUES ($1, $2, $3) RETURNING uuid, email, name',
      [uuid(), email, name]
    );

    // Insert hashed password to database.
    await dbClient.query('INSERT INTO passwords (amigo_uuid, hash) VALUES ($1, $2)', [
      queryResult.rows[0].uuid,
      hashedPassword
    ]);

    // Sign a JWT with user info.
    const signedJwt = await new Promise((resolve, _) => {
      jwt.sign(
        { uuid: queryResult.rows[0].uuid },
        privateKey,
        { algorithm: 'RS256' },
        (error, token) => {
          if (error) throw error;
          resolve(token);
        }
      );
    });

    return response.status(201).json({
      data: {
        amigo: { ...queryResult.rows[0] },
        accessToken: signedJwt
      },
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
    const { email, password } = request.body;
    let queryResult: QueryResult;

    // Check if email is already in use.
    queryResult = await dbClient.query(
      'SELECT uuid FROM amigos WHERE email = $1 AND is_deleted = FALSE',
      [email]
    );

    // Return `400` if email is not found.
    if (queryResult.rowCount < 1) {
      return response.status(400).json({
        message: 'Email is not found.',
        timestamp: getTimestamp()
      });
    }

    // Verify password.
    const uuid = queryResult.rows[0].uuid;
    queryResult = await dbClient.query(`SELECT hash FROM passwords WHERE amigo_uuid = $1`, [uuid]);

    const isPasswordValid = await new Promise((resolve, reject) => {
      bcrypt.compare(password, queryResult.rows[0].hash, (error, result) => {
        if (error) reject(false);
        resolve(result);
      });
    });

    if (!isPasswordValid) {
      return response.status(400).json({
        message: 'Incorrect password.',
        timestamp: getTimestamp()
      });
    }

    // Get user info and sign a JWT.
    queryResult = await dbClient.query('SELECT uuid, email, name FROM amigos WHERE uuid = $1', [
      uuid
    ]);

    const signedJwt = await new Promise((resolve, _) => {
      jwt.sign(
        { uuid: queryResult.rows[0].uuid },
        privateKey,
        { algorithm: 'RS256' },
        (error, token) => {
          if (error) throw error;
          resolve(token);
        }
      );
    });

    return response.status(201).json({
      data: {
        amigo: { ...queryResult.rows[0] },
        accessToken: signedJwt
      },
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
