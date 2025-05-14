import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class UpdateCustomerDto extends PartialType(RegisterDto) {}
