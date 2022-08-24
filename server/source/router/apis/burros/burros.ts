// EXTERNAL IMPORTS
import { Router, Request, Response } from 'express';
import { QueryResult } from 'pg';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

// SHARED IMPORTS
import { JwtPayload, Burro, Churro } from '@interfaces';
import { verifyAccessToken, parseAmigoUuid } from '@middleware';
import { getTimestamp } from '@utils';
import { dbClient } from '@database';

export const burrosRoute = '/burros';
export const burrosRouter = Router();

burrosRouter.get('/ping', (_: Request, response: Response) => {
  return response.status(200).json({
    message: 'pong',
    timestamp: getTimestamp()
  });
});

burrosRouter.use(verifyAccessToken);
burrosRouter.use(parseAmigoUuid);

burrosRouter.get('/', async (_: Request, response: Response) => {
  try {
    const { amigoUuid } = response.locals;
    let queryResult: QueryResult;

    // Get all burros created by amigo with matching UUID.
    queryResult = await dbClient.query(
      `
        SELECT uuid, created_by, name, description, created_on, updated_on
        FROM burros 
        WHERE created_by = $1 AND is_deleted = FALSE
      `,
      [amigoUuid]
    );

    if (queryResult.rowCount < 1) {
      return response.status(200).json({
        message: 'No burros found.',
        timestamp: getTimestamp()
      });
    }

    // Decamelize query results manually.
    const burros: Array<Burro> = [];
    for (const row of queryResult.rows) {
      burros.push({
        uuid: row.uuid,
        createdBy: row.created_by,
        name: row.name,
        description: row.description,
        createdOn: row.createdOn,
        updatedOn: row.updated_on
      });
    }

    return response.status(200).json({
      data: { burros },
      message: 'Burros found.',
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

burrosRouter.get('/:uuid', async (request: Request, response: Response) => {
  try {
    const { uuid: burroUuid } = request.params;
    const { amigoUuid } = response.locals;
    let queryResult: QueryResult;

    // Get burro with matching UUID created by amigo with matching UUID.
    queryResult = await dbClient.query(
      `
        SELECT uuid, created_by, name, description, created_on, updated_on
        FROM burros
        WHERE uuid = $1 AND created_by = $2 AND is_deleted = FALSE
      `,
      [burroUuid, amigoUuid]
    );

    if (queryResult.rowCount < 1) {
      return response.status(200).json({
        message: 'No burro found.',
        timestamp: getTimestamp()
      });
    }

    // Decamelize query result manually.
    const row = queryResult.rows[0];
    const burro: Burro = {
      uuid: row.uuid,
      createdBy: row.created_by,
      name: row.name,
      description: row.description,
      createdOn: row.createdOn,
      updatedOn: row.updated_on
    };

    return response.status(200).json({
      data: { burro },
      message: 'Burros found.',
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

// to do: get amigos "following" a burro
burrosRouter.get('/:uuid/amigos', async (request: Request, response: Response) => {
  try {
    return response.status(200).json({
      // data: {  },
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

burrosRouter.get('/:uuid/churros', async (request: Request, response: Response) => {
  try {
    const { uuid: burroUuid } = request.params;
    const { amigoUuid } = response.locals;
    let queryResult: QueryResult;

    // Get all churros of a burro with matching UUID.
    queryResult = await dbClient.query(
      `
        SELECT uuid, burro_uuid, created_by, name, description, reward, created_on, updated_on
        FROM churros
        WHERE burro_uuid = $1 AND created_by = $2 AND is_deleted = FALSE
      `,
      [burroUuid, amigoUuid]
    );

    if (queryResult.rows.length < 1) {
      return response.status(200).json({
        message: 'No churros found.',
        timestamp: getTimestamp()
      });
    }

    // Decamelize query results manually.
    const churros: Array<Churro> = [];
    for (const row of queryResult.rows) {
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

burrosRouter.post('/', async (request: Request, response: Response) => {
  try {
    const { burro } = request.body;
    const { amigoUuid } = response.locals;
    let queryResult: QueryResult;

    // Create new burro.
    queryResult = await dbClient.query(
      `
        INSERT INTO burros (uuid, created_by, name, description)
        VALUES ($1, $2, $3, $4)
        RETURNING uuid, created_by, name, description, created_on, updated_on
      `,
      [uuid(), amigoUuid, burro.name, burro.description]
    );

    // Decamelize query result manually.
    const row = queryResult.rows[0];
    const createdBurro: Burro = {
      uuid: row.uuid,
      createdBy: row.created_by,
      name: row.name,
      description: row.description,
      createdOn: row.createdOn,
      updatedOn: row.updated_on
    };

    return response.status(200).json({
      data: { burro: createdBurro },
      message: 'Created burro.',
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

burrosRouter.post('/:uuid/churros', async (request: Request, response: Response) => {
  try {
    const { uuid: burroUuid } = request.params;
    const { churro } = request.body;
    const { amigoUuid } = response.locals;
    let queryResult: QueryResult;

    // Check if burro UUID is valid.
    queryResult = await dbClient.query(
      `
        SELECT uuid
        FROM burros
        WHERE uuid = $1
        LIMIT 1
      `,
      [burroUuid]
    );

    if (queryResult.rowCount < 1) {
      return response.status(400).json({
        message: 'Invalid burro UUID.',
        timestamp: getTimestamp()
      });
    }

    // Create new churro.
    queryResult = await dbClient.query(
      `
        INSERT INTO churros (uuid, burro_uuid, created_by, name, description, reward)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING uuid, burro_uuid, created_by, name, description, reward, created_on, updated_on
      `,
      [uuid(), burroUuid, amigoUuid, churro.name, churro.description, churro.reward]
    );

    // Decamelize query result manually.
    const row = queryResult.rows[0];
    const createdChurro: Churro = {
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
      data: { churro: createdChurro },
      message: 'Created churro.',
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

burrosRouter.put('/:uuid', async (request: Request, response: Response) => {
  try {
    const { uuid: burroUuid } = request.params;
    const { burro } = request.body;
    const { amigoUuid } = response.locals;
    let queryResult: QueryResult;

    // Update burro with matching UUID created by amigo with matching UUID.
    queryResult = await dbClient.query(
      `
        UPDATE burros
        SET name = $1, description = $2, updated_on = $3
        WHERE uuid = $4 AND created_by = $5 AND is_deleted = FALSE
        RETURNING uuid, created_by, name, description, created_on, updated_on
      `,
      [burro.name, burro.description, new Date(), burroUuid, amigoUuid]
    );

    if (queryResult.rowCount < 1) {
      return response.status(200).json({
        message: 'No burro found.',
        timestamp: getTimestamp()
      });
    }

    // Decamelize query result manually.
    const row = queryResult.rows[0];
    const updatedBurro: Burro = {
      uuid: row.uuid,
      createdBy: row.created_by,
      name: row.name,
      description: row.description,
      createdOn: row.createdOn,
      updatedOn: row.updated_on
    };

    return response.status(200).json({
      data: { burro: updatedBurro },
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

burrosRouter.delete('/:uuid', async (request: Request, response: Response) => {
  try {
    const { uuid: burroUuid } = request.params;
    const { amigoUuid } = response.locals;
    let queryResult: QueryResult;

    // Soft delete burro with matching UUID created by amigo with matching UUID.
    queryResult = await dbClient.query(
      `
        UPDATE burros
        SET is_deleted = TRUE
        WHERE uuid = $1 AND created_by = $2 AND is_deleted = FALSE
        RETURNING uuid, created_by, name, description, created_on, updated_on
      `,
      [burroUuid, amigoUuid]
    );

    if (queryResult.rowCount < 1) {
      return response.status(200).json({
        message: 'No burro found.',
        timestamp: getTimestamp()
      });
    }

    return response.status(200).json({
      message: 'Deleted burro.',
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
