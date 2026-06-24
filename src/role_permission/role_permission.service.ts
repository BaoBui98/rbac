import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async assignPermissions(assignPermissionsDto: AssignPermissionsDto) {
    const { roleId, permissionId } = assignPermissionsDto;

    // Chuẩn bị mảng các dòng dữ liệu để bulk insert
    const values = permissionId.map(pId => ({
      role_id: roleId,
      permission_id: pId,
    }));

    // Sử dụng Bulk Insert kết hợp ON CONFLICT DO NOTHING (orIgnore)
    // Nếu có cặp role-permission nào đã tồn tại (lỗi trùng lặp khóa chính), Postgres sẽ tự động bỏ qua dòng đó và tiếp tục insert các dòng khác.
    await this.roleRepository.createQueryBuilder()
      .insert()
      .into('role_permissions')
      .values(values)
      .orIgnore() // Tương đương ON CONFLICT DO NOTHING
      .execute();

    return {
      message: 'Bulk insert gán quyền hoàn tất',
      insertedCount: values.length,
    };
  }
}
