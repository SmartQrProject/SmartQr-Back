import { Module, Res } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardCode } from 'src/shared/entities/reward-code.entity';
import { RewardCodeService } from './reward-code.service';
import { RewardCodeController } from './reward-code.controller';
import { Restaurant } from 'src/shared/entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RewardCode, Restaurant])],
  providers: [RewardCodeService],
  controllers: [RewardCodeController],
  exports: [RewardCodeService],
})
export class RewardCodeModule {}
