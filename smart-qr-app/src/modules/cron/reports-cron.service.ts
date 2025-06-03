import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ReportsService } from '../reports/reports.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import * as dayjs from 'dayjs';
import { MailService } from 'src/common/services/mail.service';
import { ReportsDto } from '../../modules/cron/dto/reportes.dto';
import { todo } from 'node:test';
import { generatePdfBuffer } from 'src/utils/pdf-generator';

@Injectable()
export class ReportsCronService {
  constructor(
    private readonly reportsService: ReportsService,
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    private mailService: MailService,
  ) {}

  @Cron('59 23 * * *')
  //@Cron('* * * * *')
  async reportsMail() {
    const to = dayjs().subtract(1, 'day').endOf('day');
    const from = to.subtract(6, 'day').startOf('day');

    const fromStr = from.toISOString();
    const toStr = to.toISOString();

    const restaurants = await this.restaurantRepo.find({
      where: { is_active: true },
      select: ['slug', 'name', 'owner_email'],
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

        console.log(`📊 Reporte generado para: ${resto.name} (${slug}) ${resto.owner_email}`);

        // console.dir(
        //   {
        //     getSalesTotalWeek,
        //     getTopProductsWeek,
        //     getLeastSoldProductsWeek,
        //     getSalesByCategoryWeek,
        //     getSalesFrequencyWeek,
        //     getCustomersReport,
        //     getCustomerTypesWeek,
        //   },
        //   { depth: null },
        // );

        const todoLosReportes: ReportsDto = {
          getSalesTotalWeek,
          getTopProductsWeek,
          getLeastSoldProductsWeek,
          getSalesByCategoryWeek,
          getSalesFrequencyWeek,
          getCustomersReport,
          getCustomerTypesWeek,
        };
        const subject = `Your daily summary of Bussiness Performance in ${resto.name}`;
        const headerText = `Hello ${resto.owner_email}`;
        const html = this.mailService.generateHtmlReport(todoLosReportes);
        const pdfHtml = this.mailService.generateHtmlReportWithCover(todoLosReportes, resto.name, fromStr, toStr);
        const pdfBuffer = await generatePdfBuffer(pdfHtml);

        await this.mailService.sendMailWithAttachment(resto.owner_email, subject, headerText, html, {
          filename: `weekly-report-${slug}.pdf`,
          content: pdfBuffer,
        });
      } catch (err) {
        console.error(`❌ Error al generar el reporte para ${slug}:`, err.message);
      }
    }
  }
}
