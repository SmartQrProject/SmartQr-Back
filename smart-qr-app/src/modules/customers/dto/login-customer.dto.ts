import { CreateCustomerDto } from './create-customer.dto';
import { PickType } from '@nestjs/swagger';

export class LogInCustomerDto extends PickType(CreateCustomerDto, [
  'email',
  'password',
]) {}
