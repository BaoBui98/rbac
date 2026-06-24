import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoleTable1782117566784 implements MigrationInterface {
    name = 'CreateRoleTable1782117566784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_inheritance" ("role_id" uuid NOT NULL, "inherited_role_id" uuid NOT NULL, CONSTRAINT "PK_20db8b629983b62f129f872dc20" PRIMARY KEY ("role_id", "inherited_role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1a5a1be0ff83033579522b0e4e" ON "role_inheritance" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_614bb881ef7b8e7fdc6c068d8d" ON "role_inheritance" ("inherited_role_id") `);
        await queryRunner.query(`ALTER TABLE "role_inheritance" ADD CONSTRAINT "FK_1a5a1be0ff83033579522b0e4e5" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_inheritance" ADD CONSTRAINT "FK_614bb881ef7b8e7fdc6c068d8d1" FOREIGN KEY ("inherited_role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_inheritance" DROP CONSTRAINT "FK_614bb881ef7b8e7fdc6c068d8d1"`);
        await queryRunner.query(`ALTER TABLE "role_inheritance" DROP CONSTRAINT "FK_1a5a1be0ff83033579522b0e4e5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_614bb881ef7b8e7fdc6c068d8d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1a5a1be0ff83033579522b0e4e"`);
        await queryRunner.query(`DROP TABLE "role_inheritance"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
