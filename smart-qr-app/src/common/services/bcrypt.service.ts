import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from 'src/config/env.loader';

@Injectable()
export class BcryptService {
  async hash(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
