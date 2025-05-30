import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GetSalesDto } from './dto/get-sales.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  GetCustomersReportDoc,
  GetCustomerTypesDoc,
  GetMonthlyRestaurantsStatsDoc,
  GetRestaurantCustomerReachDoc,
  GetRestaurantOwnerContactsDoc,
  GetSalesByCategoryDoc,
  GetSalesFrequencyDoc,
  GetSalesReportDoc,
  GetSubscriptionStatsDoc,
  GetTopProductsDoc,
} from './swagger/reports.decorator';
import { GetTopProductsDto } from './dto/get-top-products.dto';
import { GetSalesByCategoryDto } from './dto/get-sales-by-category.dto';
import { GetSalesFrequencyDto } from './dto/get-sales-frequency.dto';
import { GetCustomersReportDto } from './dto/get-customers.dto';
import { GetCustomerTypesDto } from './dto/get-customer-types.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/decorators/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller(':slug/reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
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
  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @GetTopProductsDoc()
  async getTopProducts(@Param('slug') slug: string, @Query() query: GetTopProductsDto) {
    return this.reportsService.getTopProducts(slug, query.from, query.to, query.sort || 'desc');
  }

  @Get('sales-by-category')
  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @GetSalesByCategoryDoc()
  async getSalesByCategory(@Param('slug') slug: string, @Query() query: GetSalesByCategoryDto) {
    const { from, to, sort } = query;
    const data = await this.reportsService.getSalesByCategory(from, to, slug, sort);
    return data;
  }

  @Get('sales-frequency')
  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @GetSalesFrequencyDoc()
  async getSalesFrequency(@Param('slug') slug: string, @Query() query: GetSalesFrequencyDto) {
    return this.reportsService.getSalesFrequency(slug, query.group);
  }

  @Get('customers')
  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @GetCustomersReportDoc()
  async getCustomerStats(@Param('slug') slug: string, @Query() query: GetCustomersReportDto) {
    return this.reportsService.getCustomersReport(slug, query);
  }

  @Get('customer-types')
  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @GetCustomerTypesDoc()
  async getCustomerTypes(@Param('slug') slug: string, @Query() query: GetCustomerTypesDto) {
    return this.reportsService.getCustomerTypes(slug, query);
  }

  @Get('admin/subscriptions')
  @Roles(Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @GetSubscriptionStatsDoc()
  async getSubscriptionStats() {
    return this.reportsService.getSubscriptionStats();
  }

  @Get('admin/restaurants')
  @Roles(Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @GetMonthlyRestaurantsStatsDoc()
  async getMonthlyRestaurantStats() {
    return this.reportsService.getMonthlyRestaurantStats();
  }

  @Get('admin/customers')
  @Roles(Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @GetRestaurantCustomerReachDoc()
  async getRestaurantReach() {
    return this.reportsService.getRestaurantCustomerReach();
  }

  @Get('admin/owners')
  @Roles(Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @GetRestaurantOwnerContactsDoc()
  async getOwnerContacts() {
    return this.reportsService.getRestaurantOwnerContacts();
  }
}
