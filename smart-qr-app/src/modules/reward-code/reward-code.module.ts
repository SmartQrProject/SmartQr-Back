import { Module } from '@nestjs/common';
import { RewardCodeService } from './reward-code.service';
import { RewardCodeController } from './reward-code.controller';

@Module({
  controllers: [RewardCodeController],
  providers: [RewardCodeService],
})
export class RewardCodeModule {}
