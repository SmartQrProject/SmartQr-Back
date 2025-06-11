import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveUserEmailIndex1749555406000 implements MigrationInterface {
  name = 'ActiveUserEmailIndex1749555406000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email_restaurant"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_email_restaurant_active" ON "users" ("email", "restaurantId") WHERE exist = true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email_restaurant_active"`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_users_email_restaurant" ON "users" ("email", "restaurantId")`);
  }
}