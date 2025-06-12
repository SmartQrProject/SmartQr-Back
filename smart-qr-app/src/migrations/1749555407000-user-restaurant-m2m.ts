import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRestaurantManyToMany1749555407000 implements MigrationInterface {
  name = 'UserRestaurantManyToMany1749555407000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // drop old index and column
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email_restaurant_active"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_users_restaurant"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "restaurantId"`);

    // create join table
    await queryRunner.query(`CREATE TABLE "user_restaurants" ("userId" uuid NOT NULL, "restaurantId" uuid NOT NULL, CONSTRAINT "PK_user_restaurants" PRIMARY KEY ("userId", "restaurantId"))`);
    await queryRunner.query(
      `ALTER TABLE "user_restaurants" ADD CONSTRAINT "FK_user_restaurants_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_restaurants" ADD CONSTRAINT "FK_user_restaurants_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    // new index for unique active email
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_email_active" ON "users" ("email") WHERE exist = true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email_active"`);
    await queryRunner.query(`ALTER TABLE "user_restaurants" DROP CONSTRAINT IF EXISTS "FK_user_restaurants_restaurant"`);
    await queryRunner.query(`ALTER TABLE "user_restaurants" DROP CONSTRAINT IF EXISTS "FK_user_restaurants_user"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_restaurants"`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "restaurantId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_users_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_users_email_restaurant_active" ON "users" ("email", "restaurantId") WHERE exist = true`);
  }
}
