import { CompleteUserDto } from './completo-user.dto';
import { PickType } from '@nestjs/swagger';

export class PutUserDto extends PickType(CompleteUserDto, ['name', 'email', 'password', 'confirmPassword', 'phone', 'is_active', 'role']) {}
