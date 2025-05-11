import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { AUTH0_AUDIENCE, AUTH0_ISSUER_BASE_URL } from 'src/config/env.loader';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${AUTH0_ISSUER_BASE_URL}.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: AUTH0_AUDIENCE,
      issuer: AUTH0_ISSUER_BASE_URL,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    console.log(AUTH0_AUDIENCE, AUTH0_ISSUER_BASE_URL);
    console.log(payload);
    return payload;
  }
}
