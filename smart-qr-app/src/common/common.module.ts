import { Module } from '@nestjs/common';
import { BcryptService } from './services/bcrypt.service';
import { JwtService } from './services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRE_TIME, JWT_SECRET } from 'src/config/env.loader';
import { JwtStrategy4Auth0 } from './services/jwt.strategy4Auth0';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRE_TIME },
    }),
  ],
  providers: [BcryptService, JwtService],
  exports: [BcryptService, JwtService, JwtModule],
})
export class CommonModule {}
