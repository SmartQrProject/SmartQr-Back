import { CompleteUserDto } from './completo-user.dto';
import { PickType } from '@nestjs/swagger';

export class SignInUserDto extends PickType(CompleteUserDto, ['email', 'password']) {}
