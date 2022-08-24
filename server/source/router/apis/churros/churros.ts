// EXTERNAL IMPORTS
import { Router, Request, Response } from 'express';
import { QueryResult } from 'pg';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

// SHARED IMPORTS
import { JwtPayload, Churro } from '@interfaces';
import { verifyAccessToken, parseAmigoUuid } from '@middleware';
import { getTimestamp } from '@utils';
import { dbClient } from '@database';

export const churrosRoute = '/churros';
export const churrosRouter = Router();

churrosRouter.get('/ping', (_: Request, response: Response) => {
  return response.status(200).json({
    message: 'pong',
    timestamp: getTimestamp()
  });
});

churrosRouter.use(verifyAccessToken);
churrosRouter.use(parseAmigoUuid);

churrosRouter.get('/', async (_: Request, response: Response) => {
  try {
    const { amigoUuid } = response.locals;
    let rows: Array<any> = [];
    let queryResult: QueryResult;

    // Get all churros created by amigo with matching UUID.
    queryResult = await dbClient.query(
      `
        SELECT uuid, burro_uuid, created_by, name, description, reward, created_on, updated_on
        FROM churros
        WHERE created_by = $1 AND is_deleted = FALSE
      `,
      [amigoUuid]
    );
    rows = [...rows, ...queryResult.rows];

    // Get all churros assigned to amigo with matching UUID.
    queryResult = await dbClient.query(
      `
        SELECT c.uuid, c.burro_uuid, c.created_by, c.name, c.description, c.reward, c.created_on, c.updated_on
        FROM amigos__churros ac
        INNER JOIN churros c ON ac.churro_uuid = c.uuid
        WHERE ac.amigo_uuid = $1 AND ac.completed_on = NULL AND c.is_deleted = FALSE
      `,
      [amigoUuid]
    );
    rows = [...rows, ...queryResult.rows];

    if (rows.length < 1) {
      return response.status(200).json({
        message: 'No churros found.',
        timestamp: getTimestamp()
      });
    }

    // Decamelize query results manually.
    const churros: Array<Churro> = [];
    for (const row of rows) {
      churros.push({
        uuid: row.uuid,
        burroUuid: row.burro_uuid,
        createdBy: row.created_by,
        name: row.name,
        description: row.description,
        reward: row.reward,
        createdOn: row.createdOn,
        updatedOn: row.updated_on
      });
    }

    return response.status(200).json({
      data: { churros },
      message: 'Churros found.',
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

churrosRouter.get('/:uuid', async (request: Request, response: Response) => {
  try {
    const { uuid: churroUuid } = request.params;
    let queryResult: QueryResult;

    // Get churro by matching UUID.
    queryResult = await dbClient.query(
      `
        SELECT uuid, burro_uuid, created_by, name, description, reward, created_on, updated_on
        FROM churros
        WHERE uuid = $1 AND is_deleted = FALSE
        LIMIT 1
      `,
      [churroUuid]
    );

    if (queryResult.rowCount < 1) {
      return response.status(200).json({
        message: 'No churro found.',
        timestamp: getTimestamp()
      });
    }

    // Decamelize query results manually.
    const row = queryResult.rows[0];
    const churro: Churro = {
      uuid: row.uuid,
      burroUuid: row.burro_uuid,
      createdBy: row.created_by,
      name: row.name,
      description: row.description,
      reward: row.reward,
      createdOn: row.createdOn,
      updatedOn: row.updated_on
    };

    return response.status(200).json({
      data: { churro },
      message: 'Churros found.',
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

churrosRouter.put('/:uuid', async (request: Request, response: Response) => {
  try {
    const { uuid: churroUuid } = request.params;
    const { churro } = request.body;
    const { amigoUuid } = response.locals;
    let queryResult: QueryResult;

    // Update churro with matching UUID created by amigo with matching UUID.
    queryResult = await dbClient.query(
      `
        UPDATE churros
        SET name = $1, description = $2, reward = $3, updated_on = $4
        WHERE uuid = $5 AND created_by = $6 AND is_deleted = FALSE
        RETURNING uuid, burro_uuid, created_by, name, description, reward, created_on, updated_on
      `,
      [
        churro.name,
        churro.description,
        churro.reward,
        new Date(),
        churroUuid,
        amigoUuid
      ]
    );

    if (queryResult.rowCount < 1) {
      return response.status(200).json({
        message: 'No churro found.',
        timestamp: getTimestamp()
      });
    }

    // Decamelize query results manually.
    const row = queryResult.rows[0];
    const updatedChurro: Churro = {
      uuid: row.uuid,
      burroUuid: row.burro_uuid,
      createdBy: row.created_by,
      name: row.name,
      description: row.description,
      reward: row.reward,
      createdOn: row.createdOn,
      updatedOn: row.updated_on
    };

    return response.status(200).json({
      data: { churro: updatedChurro },
      message: 'Updated burro.',
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
