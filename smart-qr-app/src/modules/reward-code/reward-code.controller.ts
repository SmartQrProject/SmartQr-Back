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
import { ApiParam } from '@nestjs/swagger';

@Controller(':slug/reward-codes')
export class RewardCodeController {
  constructor(private readonly rewardCodeService: RewardCodeService) {}

  @Post()
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  async create(@Param('slug') slug: string, @Body() dto: CreateRewardCodeDto) {
    return this.rewardCodeService.create(dto);
  }

  @Get()
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  async findAll(@Param('slug') slug: string) {
    return this.rewardCodeService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Reward Code ID',
    example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
  })
  async findOne(@Param('slug') slug: string, @Param('id') id: string) {
    return this.rewardCodeService.findOne(id);
  }

  @Put(':id')
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Reward Code ID',
    example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
  })
  async update(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Body() data: Partial<CreateRewardCodeDto>,
  ) {
    return this.rewardCodeService.update(id, data);
  }

  @Delete(':id')
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Reward Code ID',
    example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
  })
  async remove(@Param('slug') slug: string, @Param('id') id: string) {
    return this.rewardCodeService.remove(id);
  }
}
