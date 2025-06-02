import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from 'src/common/services/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    if (typeof request.headers['authorization'] !== 'string') {
      throw new UnauthorizedException('You must be Logged In or Authorization missing');
    }

    const authHeader = request.headers.authorization;
    if (typeof authHeader !== 'string' || !authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing authorization/token header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Bearer token not found');
    }

    const payload = this.jwtService.verifyToken(token);

    if (!payload) throw new UnauthorizedException('Invalid token inválido or expired');
    (request as any).user = payload;

    return true;
  }
}
