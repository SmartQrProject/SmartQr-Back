import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReportsService } from '../reports/reports.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import * as dayjs from 'dayjs';
import { MailService } from 'src/common/services/mail.service';

@Injectable()
export class ReportsCronService {
  constructor(
    private readonly reportsService: ReportsService,
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    private mailService: MailService,
  ) {}

  @Cron('59 23 * * *')
  //@Cron('*/1 * * * *')
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
      const restaurant = resto;

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

        console.log(`📊 Reporte generado para: ${resto.name} (${slug}) ${restaurant.owner_email}`);
        if (slug == 'eli-cafe') {
          this.sendEmail(restaurant, 'Top Products Of The Week', getTopProductsWeek);
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
        }
      } catch (err) {
        console.error(`❌ Erro r al generar el reporte para ${slug}:`, err.message);
      }
    }
  }

  async sendEmail(resto: Restaurant, reportName, report: object) {
    const subject = `Your daily report ${reportName} it is here. `;
    const headerText = `Hello ${resto.name}, <br>  Check this report out.<br>`;
    const htmlTemplate = 'report';
    await this.mailService.sendMail('amigogabrielernesto@gmail.com', subject, headerText, htmlTemplate, report);
  }
}
