import { CompletoCustomerDto } from './completo-customer.dto';
import { PickType } from '@nestjs/swagger';

export class CreateCustomerDto extends PickType(CompletoCustomerDto, [
  'email',
  'phone',
  'name',
  'picture',
  'reward',
  'password',
  'confirmPassword',
]) {}
