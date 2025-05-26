import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RewardCode } from 'src/shared/entities/reward-code.entity';
import { CreateRewardCodeDto } from './dto/create-reward-code.dto';
import { Restaurant } from 'src/shared/entities/restaurant.entity';

@Injectable()
export class RewardCodeService {
  constructor(
    @InjectRepository(RewardCode)
    private rewardCodeRepo: Repository<RewardCode>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  private generateCode(length = 10): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }

  async generateUniqueCode(): Promise<string> {
    let code: string;
    let exists: RewardCode | null;

    do {
      code = this.generateCode();
      exists = await this.rewardCodeRepo.findOne({ where: { code } });
    } while (exists);

    return code;
  }

  async create(dto: CreateRewardCodeDto, slug: string): Promise<{ id: string; code: string; percentage: number }> {
    const code = await this.generateUniqueCode();

    const restaurant = await this.restaurantRepository.findOne({
      where: { slug },
    });

    if (!restaurant) {
      throw new NotFoundException(`❌ Restaurant with slug '${slug}' not found`);
    }

    const newReward = this.rewardCodeRepo.create({
      code,
      percentage: dto.percentage,
      isActive: true,
      restaurant,
    });

    const saved = await this.rewardCodeRepo.save(newReward);

    return {
      id: saved.id,
      code: saved.code,
      percentage: saved.percentage,
    };
  }

  async findAll(slug: string): Promise<RewardCode[]> {
    return this.rewardCodeRepo
      .createQueryBuilder('reward')
      .leftJoin('reward.restaurant', 'restaurant')
      .addSelect(['restaurant.slug']) // ⬅️ Solo selecciona el slug
      .where('reward.exist = :exist', { exist: true })
      .andWhere('restaurant.slug = :slug', { slug })
      .getMany();
  }

  async findOne(id: string): Promise<RewardCode> {
    const reward = await this.rewardCodeRepo.findOne({
      where: { id, exist: true },
    });
    if (!reward) throw new NotFoundException('Code not found');
    return reward;
  }

  async update(id: string, data: Partial<RewardCode>): Promise<RewardCode> {
    const reward = await this.findOne(id);
    Object.assign(reward, data);
    return this.rewardCodeRepo.save(reward);
  }

  async remove(id: string): Promise<{ message: string }> {
    const reward = await this.findOne(id);
    reward.exist = false;
    await this.rewardCodeRepo.save(reward);
    return { message: 'Code logically deleted' };
  }

  async deactivateCode(code: string): Promise<void> {
    const reward = await this.rewardCodeRepo.findOne({
      where: { code, isActive: true },
    });
    if (!reward) throw new NotFoundException('Invalid or already used code');

    reward.isActive = false;
    await this.rewardCodeRepo.save(reward);
  }

  async findOneByCode(code: string): Promise<RewardCode | null> {
    return this.rewardCodeRepo.findOne({ where: { code, exist: true, isActive: true } });
  }
}
