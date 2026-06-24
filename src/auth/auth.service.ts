import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { HashService } from '../common/services/hash.service';
import { TokenService } from '../common/services/jwt.service';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto) {
    const roleEmployee = await this.rolesService.findByNameWithPermissions('employee');
    if (!roleEmployee) {
      throw new BadRequestException('Role employee không tồn tại trong hệ thống');
    }

    const newUser = await this.usersService.create({
      ...registerDto,
      roleId: roleEmployee.id,
    });

    const { password, ...result } = newUser;
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Tìm user thông qua UsersService thay vì dùng chung repository
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // So sánh password bằng HashService
    const isPasswordValid = await this.hashService.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // Chuẩn bị JWT payload
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role?.name,
    };

    // Tạo cặp token mới
    const tokens = await this.tokenService.generateTokens(payload);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role?.name
      }
    };
  }

  async getProfile(userId: string) {
    // Tìm profile thông qua UsersService
    const user = await this.usersService.findById(userId);

    // Loại bỏ password trước khi trả về client
    const { password, ...result } = user;
    return result;
  }
}
