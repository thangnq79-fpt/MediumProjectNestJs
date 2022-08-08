import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1659663637990 implements MigrationInterface {
  name = 'SeedDb1659663637990';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('reactJs'),('vueJs')`,
    );

    await queryRunner.query(
      `INSERT INTO users (username, email, password) VALUES ('thang', 'thang@gmail.com','$2b$10$DX3nTmsmIEGDXnBgBlBwc.Fnu5u86jBSN4G5BKvaL8S/uG35fqoRy')`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First Article','First Article Description','First Article Body','reactJs', 1)`,
    );
  }

  public async down(): Promise<void> {}
}
