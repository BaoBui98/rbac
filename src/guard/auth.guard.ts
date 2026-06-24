import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';
import { StatusCode } from '../common/statusCode/statusCode';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Kiểm tra xem route có gắn @Public() không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Bỏ qua verify token
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Không tìm thấy token truy cập (Access Token)');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'your-super-secret-key';
      // 2. Verify Token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret
      });
      console.log("payload", payload);


      // 3. Gán payload vào request để sử dụng về sau
      request['user'] = payload;
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        console.log('error', error);
        throw new HttpException('Token đã hết hạn', StatusCode.TOKEN_EXPIRED);
      }
      throw new UnauthorizedException('Token không hợp lệ');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
