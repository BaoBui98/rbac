import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractBaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('projects')
export class Project extends AbstractBaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  start_date: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  end_date: Date;

  @Column({ name: 'team_size', type: 'int', default: 0 })
  team_size: number;

  @Column({ name: 'mentor_id', type: 'uuid', nullable: true })
  mentorId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'mentor_id' })
  mentor: User;

  @Column({ type: 'varchar', length: 100, nullable: true })
  status: string;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  link: Record<string, string>;
}
