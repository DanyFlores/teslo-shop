import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1723011180510 implements MigrationInterface {
    name = ' $npmConfigName1723011180510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_image" ("id" SERIAL NOT NULL, "url" text NOT NULL, "productId" uuid, CONSTRAINT "PK_99d98a80f57857d51b5f63c8240" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "price" numeric NOT NULL DEFAULT '0', "description" text, "slug" text NOT NULL, "stock" integer NOT NULL DEFAULT '0', "sizes" text array NOT NULL, "gender" text NOT NULL, CONSTRAINT "UQ_c30f00a871de74c8e8c213acc4a" UNIQUE ("title"), CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_image" DROP CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "product_image"`);
    }

}
