import { CreateUserDto } from './create-user.dto';
import { PickType } from '@nestjs/swagger';

export class PutUserDto extends PickType(CreateUserDto, [
  'name',
  'email',
  'password',
  'confirmPassword',
]) {}
