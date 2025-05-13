// src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard as Guarda } from '@nestjs/passport';

@Injectable()
export class JwtAuth0Guard extends Guarda('jwt') {}
