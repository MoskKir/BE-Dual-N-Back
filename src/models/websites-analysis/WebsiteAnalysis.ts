import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WebsiteAnalysis {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ unique: false, nullable: false })
  website_alias: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @Column({ type: 'text', nullable: true })
  publication: string;

  @Column('text', { array: true, nullable: true })
  headlines: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  negative_conclusions: unknown[] | null;

  @Column({ type: 'jsonb', nullable: true })
  positive_conclusions: unknown[] | null;

  @Column('text', { array: true, nullable: true })
  will_happen: string[];

  @Column('text', { array: true, nullable: true })
  will_not_happen: string[];

  @Column({ type: 'jsonb', nullable: true })
  analysis_ru: string;

  @Column({ type: 'jsonb', nullable: true })
  raw_response: Record<string, any> | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
