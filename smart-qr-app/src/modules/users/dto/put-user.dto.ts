import { CompleteUserDto } from './completo-user.dto';
import { PartialType, PickType } from '@nestjs/swagger';

export class PutUserDto extends PartialType(PickType(CompleteUserDto, ['name', 'password', 'confirmPassword', 'phone', 'is_active'])) {}
