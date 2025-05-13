import { CreateUserDto } from './create-user.dto';
import { PickType } from '@nestjs/swagger';

export class SignInUserDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
