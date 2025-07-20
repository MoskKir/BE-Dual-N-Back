import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ unique: false, nullable: false })
  videoId: string;

  @Column({ type: 'boolean' })
  control: boolean;

  @Column({ unique: false, nullable: false })
  videoTitle: string;

  @Column({ length: 255 })
  meta: string;

  @Column({ type: 'simple-array' })
  thumbnails: string[];

  @Column({ type: 'boolean' })
  shorts: boolean;

  @Column({ length: 255 })
  videoOwnerChannelId: string;

  @Column({ length: 255 })
  videoOwnerChannelTitle: string;

  @Column({ length: 255 })
  publishedAt: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
