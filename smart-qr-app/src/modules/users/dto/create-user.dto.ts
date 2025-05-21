import { CompleteUserDto } from './completo-user.dto';
import { PickType } from '@nestjs/swagger';

export class CreateUserDto extends PickType(CompleteUserDto, ['name', 'email', 'password', 'confirmPassword', 'role']) {}
