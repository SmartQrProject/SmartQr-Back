import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/shared/entities/order.entity';
import { CommonModule } from 'src/common/common.module';
import { Customer } from 'src/shared/entities/customer.entity';
import { Restaurant } from 'src/shared/entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Customer, Restaurant]), CommonModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
