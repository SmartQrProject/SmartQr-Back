import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveTableCodeIndex1749555405000 implements MigrationInterface {
  name = 'ActiveTableCodeIndex1749555405000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_restaurant_tables_code_restaurant"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_restaurant_tables_code_restaurant_active" ON "restaurant_tables" ("code", "restaurantId") WHERE exist = true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_restaurant_tables_code_restaurant_active"`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_restaurant_tables_code_restaurant" ON "restaurant_tables" ("code", "restaurantId")`);
  }
}