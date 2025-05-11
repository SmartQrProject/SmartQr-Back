import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  validateUserFromToken(payload: any) {
    // Podés verificar si existe en DB, sincronizar, etc.
    return payload;
  }
}
