import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
