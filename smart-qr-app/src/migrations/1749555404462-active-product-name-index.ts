import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActiveProductNameIndex1749555404462 implements MigrationInterface {
  name = 'ActiveProductNameIndex1749555404462';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_name_restaurant"`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_products_name_restaurant_active" ON "products" ("name", "restaurantId") WHERE exist = true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_name_restaurant_active"`);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_products_name_restaurant" ON "products" ("name", "restaurantId")`);
  }
}
