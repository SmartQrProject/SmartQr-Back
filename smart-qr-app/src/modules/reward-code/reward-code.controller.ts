import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { RewardCodeService } from './reward-code.service';
import { CreateRewardCodeDto } from './dto/create-reward-code.dto';

@Controller('reward-codes')
export class RewardCodeController {
  constructor(private readonly rewardCodeService: RewardCodeService) {}

  @Post()
  async create(@Body() dto: CreateRewardCodeDto) {
    return this.rewardCodeService.create(dto);
  }

  @Get()
  async findAll() {
    return this.rewardCodeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rewardCodeService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<CreateRewardCodeDto>,
  ) {
    return this.rewardCodeService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rewardCodeService.remove(id);
  }
}
