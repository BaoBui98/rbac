import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from '../roles/roles.service';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import { PERMISSION_KEY } from '../common/decorators/permission.decorator';
import { collectInheritedPermissions } from '../ultils/permission.util';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly rolesService: RolesService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 1. Kiểm tra xem route có gắn @Public() không, nếu có thì bỏ qua check permission
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        // 2. Lấy user từ request (đã được gán từ AuthGuard)
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role) {
            throw new ForbiddenException('Bạn không có quyền truy cập');
        }

        // 3. Tìm role theo tên và join với bảng role_permissions thông qua RolesService
        const role = await this.rolesService.findByNameWithPermissions(user.role);
        console.log("role", role);

        if (!role || !role.permissions) {
            throw new ForbiddenException('Không tìm thấy quyền hạn của user');
        }

        // Lấy danh sách tên quyền của user hiện tại, dùng Set để tối ưu
        let userPermissions = new Set<string>(role.permissions.map(p => p.name));

        // Nếu role có inherit quyền từ các role khác, dùng hàm đệ quy để gom tất cả permissions
        if (role.inherit && role.inherit.length > 0) {
            const visitedRoles = new Set<string>([role.name]); // Khởi tạo với role hiện tại để tránh vòng lặp
            for (const inheritRoleName of role.inherit) {
                userPermissions = await collectInheritedPermissions(inheritRoleName, this.rolesService, userPermissions, visitedRoles);
            }
        }
        console.log("userPermissions", userPermissions);


        // 4. Nếu trong danh sách permission có chứa quyền '*', cho phép đi tiếp
        if (userPermissions.has('*')) {
            return true;
        }

        // 5. Kiểm tra quyền cụ thể của route được gắn qua decorator @Permission
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions || requiredPermissions.length === 0) {
            // Nếu API không yêu cầu quyền nào và cũng không phải @Public, mà user không có quyền '*' thì chặn
            throw new ForbiddenException('Bạn không có đủ quyền thực hiện hành động này');
        }

        // Kiểm tra xem user có ít nhất 1 quyền nằm trong yêu cầu của route hay không
        const hasPermission = requiredPermissions.some(reqPerm => userPermissions.has(reqPerm));

        if (hasPermission) {
            return true;
        }

        // Nếu không khớp quyền nào, chặn lại
        throw new ForbiddenException('Bạn không có đủ quyền thực hiện hành động này');
    }
}
