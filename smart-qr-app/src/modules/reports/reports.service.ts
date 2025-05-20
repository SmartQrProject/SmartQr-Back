import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/shared/entities/order.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
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
}
