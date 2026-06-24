import { RolesService } from '../roles/roles.service';

export async function collectInheritedPermissions(
  roleName: string,
  rolesService: RolesService,
  userPermissions: Set<string> = new Set(),
  visitedRoles: Set<string> = new Set()
): Promise<Set<string>> {
  // Nếu role này đã được ghé thăm rồi thì bỏ qua, tránh vòng lặp vô hạn
  if (visitedRoles.has(roleName)) {
    return userPermissions;
  }

  visitedRoles.add(roleName);

  const role = await rolesService.findByNameWithPermissions(roleName);
  if (!role) {
    return userPermissions;
  }

  // Gom permissions của role này vào Set
  if (role.permissions) {
    role.permissions.forEach(p => userPermissions.add(p.name));
  }

  // Đệ quy lấy tiếp permissions từ các role mà role này kế thừa
  if (role.inherit && role.inherit.length > 0) {
    for (const inheritedRoleName of role.inherit) {
      await collectInheritedPermissions(
        inheritedRoleName,
        rolesService,
        userPermissions,
        visitedRoles
      );
    }
  }

  return userPermissions;
}
