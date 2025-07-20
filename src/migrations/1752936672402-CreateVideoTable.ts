import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migrations1752936672402 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'video',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'videoId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'control',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'videoTitle',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'meta',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'thumbnails',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'shorts',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'videoOwnerChannelId',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'videoOwnerChannelTitle',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'publishedAt',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user', true);
  }

}
