import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GetSalesDto } from './dto/get-sales.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { GetSalesByCategoryDoc, GetSalesFrequencyDoc, GetSalesReportDoc, GetTopProductsDoc } from './swagger/reports.decorator';
import { GetTopProductsDto } from './dto/get-top-products.dto';
import { GetSalesByCategoryDto } from './dto/get-sales-by-category.dto';
import { GetSalesFrequencyDto } from './dto/get-sales-frequency.dto';

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

  @Get('sales-by-category')
  @GetSalesByCategoryDoc()
  async getSalesByCategory(@Param('slug') slug: string, @Query() query: GetSalesByCategoryDto) {
    const { from, to, sort } = query;
    const data = await this.reportsService.getSalesByCategory(from, to, slug, sort);
    return data;
  }

  @Get('sales-frequency')
  @GetSalesFrequencyDoc()
  async getSalesFrequency(@Param('slug') slug: string, @Query() query: GetSalesFrequencyDto) {
    return this.reportsService.getSalesFrequency(slug, query.group);
  }
}
