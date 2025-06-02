import { CompletoCustomerDto } from './completo-customer.dto';
import { PickType } from '@nestjs/swagger';

export class LogInCustomerDto extends PickType(CompletoCustomerDto, [
  'email',
  'password',
]) {}
