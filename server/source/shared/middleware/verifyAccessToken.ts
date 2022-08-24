// EXTERNAL IMPORTS
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// SHARED IMPORTS
import { publicKey } from '@constants';
import { getTimestamp } from '@utils';

const verifyAccessToken = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { authorization } = request.headers;
    const accessToken = authorization?.split(' ')[1] || '';

    const isAccessTokenValid = await new Promise((resolve, _) => {
      jwt.verify(accessToken, publicKey, (error: any, _: any) => {
        if (error) resolve(false);
        resolve(true);
      });
    });

    if (!isAccessTokenValid) {
      return response.status(400).json({
        message: 'Invalid access token.',
        timestamp: getTimestamp()
      });
    }

    return next();
  } catch (error) {
    return response.status(500).json({
      error,
      message: 'An error occured.',
      timestamp: getTimestamp()
    });
  }
};

export default verifyAccessToken;
