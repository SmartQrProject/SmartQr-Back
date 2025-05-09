import { PartialType } from '@nestjs/mapped-types';
import { CreateRewardCodeDto } from './create-reward-code.dto';

export class UpdateRewardCodeDto extends PartialType(CreateRewardCodeDto) {}
