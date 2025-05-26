import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { RewardCodeService } from './reward-code.service';
import { CreateRewardCodeDto } from './dto/create-reward-code.dto';
import { ApiParam } from '@nestjs/swagger';
import {
  CreateRewardCodeDoc,
  GetAllRewardCodesDoc,
  GetRewardCodeByIdDoc,
  UpdateRewardCodeDoc,
  DeleteRewardCodeDoc,
  GetRewardCodeByCodeDoc,
} from './swagger/reward-code-doc.decorator';

@Controller(':slug/reward-codes')
export class RewardCodeController {
  constructor(private readonly rewardCodeService: RewardCodeService) {}

  @Post()
  @CreateRewardCodeDoc()
  async create(@Param('slug') slug: string, @Body() dto: CreateRewardCodeDto) {
    return this.rewardCodeService.create(dto, slug);
  }

  @Get()
  @GetAllRewardCodesDoc()
  async findAll(@Param('slug') slug: string) {
    return this.rewardCodeService.findAll(slug);
  }

  @Get(':id')
  @GetRewardCodeByIdDoc()
  async findOne(@Param('slug') slug: string, @Param('id') id: string) {
    return this.rewardCodeService.findOne(id);
  }

  @Put(':id')
  @UpdateRewardCodeDoc()
  async update(@Param('slug') slug: string, @Param('id') id: string, @Body() data: Partial<CreateRewardCodeDto>) {
    return this.rewardCodeService.update(id, data);
  }

  @Delete(':id')
  @DeleteRewardCodeDoc()
  async remove(@Param('slug') slug: string, @Param('id') id: string) {
    return this.rewardCodeService.remove(id);
  }

  @Get('code/:code')
  @GetRewardCodeByCodeDoc()
  async findOneByCode(@Param('slug') slug: string, @Param('code') code: string) {
    return this.rewardCodeService.findOneByCode(code);
  }
}
