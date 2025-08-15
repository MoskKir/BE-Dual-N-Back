import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateWebsiteAnalysisTable1723728000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'website_analysis',
        columns: [
          {
            name: 'id',
            type: 'int',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'website_alias',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'publication',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'headlines',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'negative_conclusions',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'positive_conclusions',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'will_happen',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'will_not_happen',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'analysis_ru',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'raw_response',
            type: 'jsonb',
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
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('website_analysis');
  }
}
