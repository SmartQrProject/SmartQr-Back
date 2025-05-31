import { PartialType, PickType } from '@nestjs/swagger';
import { CompletoCustomerDto } from './completo-customer.dto';

export class UpdateCustomerDto extends PartialType(
  PickType(CompletoCustomerDto, [
    'name',
    //'email', // marcar como unique en la entity
    'phone',
    //'password',
    // 'confirmPassword',
    'picture',
    // 'reward',
    // 'isActive',
  ]),
) {}
