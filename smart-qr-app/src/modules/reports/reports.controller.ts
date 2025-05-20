import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GetSalesDto } from './dto/get-sales.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { GetSalesReportDoc, GetTopProductsDoc } from './swagger/reports.decorator';
import { GetTopProductsDto } from './dto/get-top-products.dto';

@Controller(':slug/reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @GetSalesReportDoc()
  async getSales(@Param('slug') slug: string, @Query() query: GetSalesDto) {
    const { from, to } = query;
    const total = await this.reportsService.getSalesTotal(from, to, slug);
    console.log('from', from);
    console.log('to', to);
    console.log('total', total);
    return { total };
  }

  @Get('topProducts')
  @GetTopProductsDoc()
  async getTopProducts(@Param('slug') slug: string, @Query() query: GetTopProductsDto) {
    return this.reportsService.getTopProducts(slug, query.from, query.to, query.sort || 'desc');
  }
}
