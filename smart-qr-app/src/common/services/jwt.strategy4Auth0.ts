import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy4Auth0 extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      issuer: 'https://dev-yxlpehy8hq451y84.us.auth0.com',
      audience: 'https://smartqr.api',
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:
          'https://dev-yxlpehy8hq451y84.us.auth0.com/.well-known/jwks.json',
      }),
    });
  }

  async validate(payload: any) {
    // Este método es llamado si el token es válido
    console.log('======');
    return payload;
  }
}
