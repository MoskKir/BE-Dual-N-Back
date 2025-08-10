import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
} from 'typeorm';

export class CreateWebsiteAnalysisTable1699999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;
    const isPostgres = dbType === 'postgres';
    const isMysql = dbType === 'mysql' || dbType === 'mariadb';

    const idType = isPostgres ? 'integer' : 'int';
    const timestampDefault = isPostgres ? 'now()' : 'CURRENT_TIMESTAMP';

    await queryRunner.createTable(
      new Table({
        name: 'website_analysis',
        columns: [
          {
            name: 'id',
            type: idType,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: !isPostgres,
          },
          {
            name: 'website_alias',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'analysis',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: timestampDefault,
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: timestampDefault,
            onUpdate: isMysql ? 'CURRENT_TIMESTAMP' : undefined,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'website_analysis',
      new TableIndex({
        name: 'IDX_website_analysis_alias',
        columnNames: ['website_alias'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('website_analysis', 'IDX_website_analysis_alias');
    await queryRunner.dropTable('website_analysis');
  }
}
