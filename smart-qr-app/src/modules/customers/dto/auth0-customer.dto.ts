import { CompletoCustomerDto } from './completo-customer.dto';
import { PickType } from '@nestjs/swagger';

export class Auth0CustomerDto extends PickType(CompletoCustomerDto, [
  'email',
  'name',
  'auth0Id',
  'picture',
]) {}
