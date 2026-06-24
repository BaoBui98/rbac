import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { AbstractBaseEntity } from '../../common/entities/base.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('roles')
export class Role extends AbstractBaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', array: true, default: [] })
  inherit: string[];

  @ManyToMany(() => Permission, { cascade: true })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
  })
  permissions: Permission[];
}
