import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReportsService } from '../reports/reports.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class ReportsCronService {
  constructor(
    private readonly reportsService: ReportsService,
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
  ) {}

  @Cron('59 23 * * *')
  async reportsMail() {
    const to = dayjs().subtract(1, 'day').endOf('day');
    const from = to.subtract(6, 'day').startOf('day');

    const fromStr = from.toISOString();
    const toStr = to.toISOString();

    const restaurants = await this.restaurantRepo.find({
      where: { is_active: true },
      select: ['slug', 'name'],
    });

    for (const resto of restaurants) {
      const slug = resto.slug;

      try {
        const getSalesTotalWeek = await this.reportsService.getSalesTotal(fromStr, toStr, slug);
        const getTopProductsWeek = await this.reportsService.getTopProducts(slug, fromStr, toStr, 'desc');
        const getLeastSoldProductsWeek = await this.reportsService.getTopProducts(slug, fromStr, toStr, 'asc');
        const getSalesByCategoryWeek = await this.reportsService.getSalesByCategory(fromStr, toStr, slug, 'desc');
        const getSalesFrequencyWeek = await this.reportsService.getSalesFrequency(slug, 'weekday');
        const getCustomersReport = await this.reportsService.getCustomersReport(slug, {});
        const getCustomerTypesWeek = await this.reportsService.getCustomerTypes(slug, {
          from: fromStr,
          to: toStr,
        });

        console.log(`📊 Reporte generado para: ${resto.name} (${slug})`);
        console.dir(
          {
            getSalesTotalWeek,
            getTopProductsWeek,
            getLeastSoldProductsWeek,
            getSalesByCategoryWeek,
            getSalesFrequencyWeek,
            getCustomersReport,
            getCustomerTypesWeek,
          },
          { depth: null },
        );
      } catch (err) {
        console.error(`❌ Erro r al generar el reporte para ${slug}:`, err.message);
      }
    }
  }
}
