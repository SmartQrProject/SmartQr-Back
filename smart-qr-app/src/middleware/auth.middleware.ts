// src/common/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

const jwtCheck = auth({
  audience: 'https://smartqr.api',
  issuerBaseURL: 'https://dev-yxlpehy8hq451y84.us.auth0.com/',
  tokenSigningAlg: 'RS256',
});

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  return jwtCheck(req, res, next);
}
