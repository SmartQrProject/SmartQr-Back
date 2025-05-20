import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/shared/entities/order.entity';
import { GetCustomersReportDto } from './dto/get-customers.dto';
import { Customer } from 'src/shared/entities/customer.entity';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import * as dayjs from 'dayjs';
import { GetCustomerTypesDto } from './dto/get-customer-types.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
  ) {}

  async getSalesTotal(start: string, end: string, slug: string): Promise<number> {
    const from = new Date(start);
    const to = new Date(end);
    to.setHours(23, 59, 59, 999);

    const result = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.total_price)', 'total')
      .innerJoin('order.restaurant', 'restaurant')
      .where('restaurant.slug = :slug', { slug })
      .andWhere('order.created_at BETWEEN :from AND :to', { from, to })
      .andWhere('order.exist = true')
      .getRawOne();

    return Number(result.total) || 0;
  }

  async getTopProducts(slug: string, from: string, to: string, sort: 'asc' | 'desc' = 'desc') {
    const start = new Date(from);
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);

    const result = await this.orderRepo
      .createQueryBuilder('order')
      .innerJoin('order.restaurant', 'restaurant')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .where('restaurant.slug = :slug', { slug })
      .andWhere('order.created_at BETWEEN :from AND :to', { from: start, to: end })
      .andWhere('order.exist = true')
      .select('product.name', 'name')
      .addSelect('SUM(item.quantity)', 'quantity')
      .groupBy('product.name')
      .orderBy('quantity', sort.toUpperCase() as 'ASC' | 'DESC')
      .limit(10)
      .getRawMany();

    return result;
  }

  async getSalesByCategory(from: string, to: string, slug: string, sort: 'asc' | 'desc' = 'desc') {
    const start = new Date(from);
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);

    const raw = await this.orderRepo
      .createQueryBuilder('order')
      .select('category.name', 'category')
      .addSelect('SUM(item.quantity * item.unit_price)', 'total')
      .addSelect('SUM(item.quantity)', 'quantity')
      .addSelect('AVG(item.unit_price)', 'average_price')
      .innerJoin('order.items', 'item')
      .innerJoin('item.product', 'product')
      .innerJoin('product.category', 'category')
      .innerJoin('order.restaurant', 'restaurant')
      .where('order.exist = true')
      .andWhere('restaurant.slug = :slug', { slug })
      .andWhere('order.created_at BETWEEN :start AND :end', { start, end })
      .groupBy('category.name')
      .orderBy('total', sort.toUpperCase() as 'ASC' | 'DESC')
      .getRawMany();

    const totalSum = raw.reduce((sum, r) => sum + Number(r.total), 0);

    return raw.map((r) => ({
      category: r.category,
      total: parseFloat(r.total),
      percentage: totalSum ? parseFloat(((r.total / totalSum) * 100).toFixed(1)) : 0,
      quantity: parseInt(r.quantity),
      average_price: parseFloat(r.average_price),
    }));
  }

  async getSalesFrequency(slug: string, group: string) {
    const qb = this.orderRepo.createQueryBuilder('order').innerJoin('order.restaurant', 'restaurant').where('restaurant.slug = :slug', { slug }).andWhere('order.exist = true');

    let baseLabels: string[] = [];
    const weekdayMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const monthMap = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    switch (group) {
      case 'hour':
        baseLabels = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
        qb.select("TO_CHAR(order.created_at, 'HH24')", 'label').addSelect('COUNT(*)', 'count').groupBy('label').orderBy('label');
        break;

      case 'weekday':
        baseLabels = weekdayMap;
        qb.select('EXTRACT(DOW FROM order.created_at)', 'index').addSelect('COUNT(*)', 'count').groupBy('index').orderBy('index');
        break;

      case 'monthday':
        const today = new Date();
        const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        baseLabels = Array.from({ length: totalDays }, (_, i) => (i + 1).toString().padStart(2, '0'));
        qb.select("TO_CHAR(order.created_at, 'DD')", 'label').addSelect('COUNT(*)', 'count').groupBy('label').orderBy('label');
        break;

      case 'month':
        baseLabels = monthMap;
        qb.select('EXTRACT(MONTH FROM order.created_at)', 'index').addSelect('COUNT(*)', 'count').groupBy('index').orderBy('index');
        break;

      default:
        return [];
    }

    const raw = await qb.getRawMany();
    const map = new Map<string, number>();

    if (group === 'weekday') {
      raw.forEach((r) => {
        const index = parseInt(r.index, 10);
        const label = weekdayMap[index];
        map.set(label, parseInt(r.count, 10));
      });
    } else if (group === 'month') {
      raw.forEach((r) => {
        const index = parseInt(r.index, 10);
        const label = monthMap[index - 1];
        map.set(label, parseInt(r.count, 10));
      });
    } else {
      raw.forEach((r) => {
        map.set(r.label.trim(), parseInt(r.count, 10));
      });
    }

    return baseLabels.map((label) => ({
      label,
      count: map.get(label) || 0,
    }));
  }

  async getCustomersReport(slug: string, query: GetCustomersReportDto) {
    const { page = '1', limit = '10', sortBy = 'orders', order = 'desc' } = query;
    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const restaurant = await this.restaurantRepo.findOne({ where: { slug } });
    if (!restaurant) return { data: [], total: 0 };

    const sortOptions = {
      name: 'c.name',
      email: 'c.email',
      createdAt: 'c.created_at',
      orders: 'COUNT(o.id)',
      totalSpent: 'COALESCE(SUM(o.total_price), 0)',
      averageOrder: 'ROUND(COALESCE(SUM(o.total_price) / NULLIF(COUNT(o.id), 0), 0), 2)',
      lastVisit: 'MAX(o.created_at)',
    };

    const sortField = sortOptions[sortBy] || 'COUNT(o.id)';

    const customers = await this.customerRepo
      .createQueryBuilder('c')
      .leftJoin('c.orders', 'o', 'o.exist = true')
      .where('c.restaurantId = :restaurantId', { restaurantId: restaurant.id })
      .andWhere('c.exist = true')
      .select('c.id', 'id')
      .addSelect('c.name', 'name')
      .addSelect('c.email', 'email')
      .addSelect('c.created_at', 'createdAt')
      .addSelect('COUNT(o.id)', 'orders')
      .addSelect('COALESCE(SUM(o.total_price), 0)', 'totalSpent')
      .addSelect('ROUND(COALESCE(SUM(o.total_price) / NULLIF(COUNT(o.id), 0), 0), 2)', 'averageOrder')
      .addSelect('MAX(o.created_at)', 'lastVisit')
      .groupBy('c.id')
      .orderBy(sortField, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(skip)
      .take(take)
      .getRawMany();

    const enhanced = customers.map((c) => ({
      ...c,
      orders: parseInt(c.orders, 10),
      totalSpent: parseFloat(c.totalSpent),
      averageOrder: parseFloat(c.averageOrder),
      daysSince: c.lastVisit ? dayjs().diff(dayjs(c.lastVisit), 'day') : null,
    }));

    const total = await this.customerRepo.count({
      where: {
        restaurant: { id: restaurant.id },
        exist: true,
      },
    });

    return {
      data: enhanced,
      total,
    };
  }

  async getCustomerTypes(slug: string, query: GetCustomerTypesDto) {
    const { from, to } = query;
    const restaurant = await this.restaurantRepo.findOne({ where: { slug } });
    if (!restaurant) return { newCustomers: 0, returningCustomers: 0, newPercentage: 0, returningPercentage: 0 };

    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const firstOrders = await this.orderRepo
      .createQueryBuilder('order')
      .select('MIN(order.created_at)', 'firstOrderDate')
      .addSelect('order.customerId', 'customerId')
      .innerJoin('order.customer', 'customer')
      .where('order.restaurantId = :restaurantId', { restaurantId: restaurant.id })
      .andWhere('order.exist = true')
      .groupBy('order.customerId')
      .getRawMany();

    const ordersInRange = await this.orderRepo
      .createQueryBuilder('order')
      .select('DISTINCT order.customerId', 'customerId')
      .where('order.restaurantId = :restaurantId', { restaurantId: restaurant.id })
      .andWhere('order.created_at BETWEEN :from AND :to', { from: fromDate, to: toDate })
      .andWhere('order.exist = true')
      .getRawMany();

    const customersInRange = ordersInRange.map((r) => r.customerId);

    const firstOrderMap = new Map<string, string>();
    for (const row of firstOrders) {
      firstOrderMap.set(row.customerId, row.firstOrderDate);
    }

    let newCustomers = 0;
    let returningCustomers = 0;

    for (const customerId of customersInRange) {
      const firstDate = firstOrderMap.get(customerId);
      if (!firstDate) continue;

      const firstOrderDate = new Date(firstDate);
      if (firstOrderDate >= fromDate && firstOrderDate <= toDate) {
        newCustomers++;
      } else {
        returningCustomers++;
      }
    }

    const total = newCustomers + returningCustomers;
    const newPercentage = total ? (newCustomers / total) * 100 : 0;
    const returningPercentage = total ? (returningCustomers / total) * 100 : 0;

    return {
      newCustomers,
      returningCustomers,
      newPercentage: parseFloat(newPercentage.toFixed(2)),
      returningPercentage: parseFloat(returningPercentage.toFixed(2)),
    };
  }
}
