import { CompletoCustomerDto } from './completo-customer.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateCustomerDto extends PickType(CompletoCustomerDto, [
  'email', //marcar como unique en la entitie
  'phone',
  'name',
  'picture',
  'reward',
  'password',
  'confirmPassword',
  'isActive',
]) {}
