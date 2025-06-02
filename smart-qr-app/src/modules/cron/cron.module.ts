import { Module } from '@nestjs/common';
import { ReportsCronService } from './reports-cron.service';
import { ReportsModule } from '../reports/reports.module';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from 'src/common/services/mail.service';

@Module({
  imports: [ReportsModule, TypeOrmModule.forFeature([Restaurant])],
  providers: [ReportsCronService, MailService],
})
export class CronModule {}
