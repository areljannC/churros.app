// EXTERNAL IMPORTS
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// SHARED IMPORTS
import { JwtPayload } from '@interfaces';
import { getTimestamp } from '@utils';

const parseAmigoUuid = (request: Request, response: Response, next: NextFunction) => {
  try {
    const { authorization } = request.headers;
    const accessToken = authorization?.split(' ')[1] || '';

    const { uuid } = jwt.decode(accessToken) as JwtPayload;
    response.locals.amigoUuid = uuid;

    return next();
  } catch (error) {}
  return response.status(500).json({
    error: 'Unable to parse amigo UUID.',
    message: 'An error occured.',
    timestamp: getTimestamp()
  });
};

export default parseAmigoUuid;
