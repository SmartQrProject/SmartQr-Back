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
}
