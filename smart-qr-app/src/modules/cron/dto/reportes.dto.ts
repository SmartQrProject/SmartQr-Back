export class TopProductDto {
  name: string;
  quantity: string;
}

export class LeastSoldProductDto {
  name: string;
  quantity: string;
}

export class SalesByCategoryDto {
  category: string;
  total: number;
  percentage: number;
  quantity: number;
  average_price: number;
}

export class SalesFrequencyDto {
  label: string;
  count: number;
}

export class CustomerReportItemDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  orders: number;
  totalSpent: number;
  averageOrder: number;
  lastVisit: Date;
  daysSince: number;
}

export class CustomerReportDto {
  data: CustomerReportItemDto[];
  total: number;
}

export class CustomerTypesDto {
  newCustomers: number;
  returningCustomers: number;
  newPercentage: number;
  returningPercentage: number;
}

export class ReportsDto {
  getSalesTotalWeek: number;

  getTopProductsWeek: TopProductDto[];

  getLeastSoldProductsWeek: LeastSoldProductDto[];

  getSalesByCategoryWeek: SalesByCategoryDto[];

  getSalesFrequencyWeek: SalesFrequencyDto[];

  getCustomersReport: CustomerReportDto;

  getCustomerTypesWeek: CustomerTypesDto;
}
