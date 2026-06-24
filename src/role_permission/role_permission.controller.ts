import { Controller, Post, Body, Param } from '@nestjs/common';
import { RolePermissionService } from './role_permission.service';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { Permission } from '../common/decorators/permission.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('role-permission')
@ApiBearerAuth()
@Controller('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  @Permission(['create_role_permission'])
  assignPermissions(@Body() assignPermissionsDto: AssignPermissionsDto) {
    return this.rolePermissionService.assignPermissions(assignPermissionsDto);
  }
}
