import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { AUTH0_AUDIENCE, AUTH0_ISSUER_URL, AUTH0_JWKS_URL } from 'src/config/env.loader';

@Injectable()
export class JwtStrategy4Auth0 extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      issuer: AUTH0_ISSUER_URL,
      audience: AUTH0_AUDIENCE,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:
          AUTH0_JWKS_URL ??
          (() => {
            throw new Error('AUTH0_JWKS_URL is not defined');
          })(),
      }),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
