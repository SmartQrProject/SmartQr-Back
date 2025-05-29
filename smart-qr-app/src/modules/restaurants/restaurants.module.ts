import { forwardRef, Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { CommonModule } from '../../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared/entities/user.entity';
import { Restaurant } from '../../shared/entities/restaurant.entity';
import { MailService } from 'src/common/services/mail.service';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, User]), CommonModule, forwardRef(() => StripeModule)],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, MailService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
