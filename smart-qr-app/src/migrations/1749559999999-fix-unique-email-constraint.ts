import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUniqueEmailConstraint1749559999999 implements MigrationInterface {
  name = 'FixUniqueEmailConstraint1749559999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "UQ_97672ac88f789774dd47f7c8be3"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email_restaurant"`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_users_email_restaurant_active" ON "users" ("email", "restaurantId") WHERE exist = true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email_restaurant_active"`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_users_email_restaurant" ON "users" ("email", "restaurantId")`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
  }
}