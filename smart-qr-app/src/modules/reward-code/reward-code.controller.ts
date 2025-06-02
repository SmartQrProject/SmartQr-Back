import { Controller, Post, Get, Param, Body, Put, Delete, UseGuards } from '@nestjs/common';
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
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/decorators/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller(':slug/reward-codes')
export class RewardCodeController {
  constructor(private readonly rewardCodeService: RewardCodeService) {}

  @Post()
  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @CreateRewardCodeDoc()
  async create(@Param('slug') slug: string, @Body() dto: CreateRewardCodeDto) {
    return this.rewardCodeService.create(dto, slug);
  }

  @Get()
  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @GetAllRewardCodesDoc()
  async findAll(@Param('slug') slug: string) {
    return this.rewardCodeService.findAll(slug);
  }

  // @Get(':id')
  //@Roles(Role.Owner)
  //@UseGuards(AuthGuard, RolesGuard)
  // @GetRewardCodeByIdDoc()
  // async findOne(@Param('slug') slug: string, @Param('id') id: string) {
  //   return this.rewardCodeService.findOne(id);
  // }

  // @Put(':id')
  // @Roles(Role.Owner)
  // @UseGuards(AuthGuard, RolesGuard)
  // @UpdateRewardCodeDoc()
  // async update(@Param('slug') slug: string, @Param('id') id: string, @Body() data: Partial<CreateRewardCodeDto>) {
  //   return this.rewardCodeService.update(id, data);
  // }

  @Delete(':id')
  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
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
