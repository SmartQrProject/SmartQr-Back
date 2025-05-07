import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JWT_EXPIRE_TIME, JWT_SECRET } from 'src/config/env.loader';

@Injectable()
export class JwtService {
  constructor(private readonly jwt: NestJwtService) {}

  generateToken(payload: object): string {
    return this.jwt.sign(payload, { secret: JWT_SECRET, expiresIn: JWT_EXPIRE_TIME });
  }

  verifyToken(token: string): any {
    try {
      return this.jwt.verify(token, { secret: JWT_SECRET });
    } catch {
      return null;
    }
  }
}
