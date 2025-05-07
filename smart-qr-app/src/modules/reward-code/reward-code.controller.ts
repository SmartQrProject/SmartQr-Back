import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RewardCodeService } from './reward-code.service';
import { CreateRewardCodeDto } from './dto/create-reward-code.dto';
import { UpdateRewardCodeDto } from './dto/update-reward-code.dto';

@Controller('reward-code')
export class RewardCodeController {
  constructor(private readonly rewardCodeService: RewardCodeService) {}

  @Post()
  create(@Body() createRewardCodeDto: CreateRewardCodeDto) {
    return this.rewardCodeService.create(createRewardCodeDto);
  }

  @Get()
  findAll() {
    return this.rewardCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rewardCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRewardCodeDto: UpdateRewardCodeDto) {
    return this.rewardCodeService.update(+id, updateRewardCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rewardCodeService.remove(+id);
  }
}
