import { Entity, Column } from 'typeorm';
import { AbstractBaseEntity } from '../../common/entities/base.entity';

@Entity('permissions')
export class Permission extends AbstractBaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;
}
