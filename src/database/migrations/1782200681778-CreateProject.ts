import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProject1782200681778 implements MigrationInterface {
    name = 'CreateProject1782200681778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "description" text, "start_date" date, "end_date" date, "team_size" integer NOT NULL DEFAULT '0', "mentor_id" uuid, "status" character varying(100), "level" integer NOT NULL DEFAULT '1', "review" text, "link" jsonb DEFAULT '{}', CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_1df9cce4d8485953c94ec04838a" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_1df9cce4d8485953c94ec04838a"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
