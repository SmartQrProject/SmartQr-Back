import { Injectable } from '@nestjs/common';
import { CreateRewardCodeDto } from './dto/create-reward-code.dto';
import { UpdateRewardCodeDto } from './dto/update-reward-code.dto';

@Injectable()
export class RewardCodeService {
  create(createRewardCodeDto: CreateRewardCodeDto) {
    return 'This action adds a new rewardCode';
  }

  findAll() {
    return `This action returns all rewardCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rewardCode`;
  }

  update(id: number, updateRewardCodeDto: UpdateRewardCodeDto) {
    return `This action updates a #${id} rewardCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} rewardCode`;
  }
}
