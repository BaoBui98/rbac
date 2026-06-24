import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Tạo ra một cặp access_token và refresh_token mới
   * @param payload Dữ liệu được nhúng vào token (thường là user info)
   */
  async generateTokens(payload: JwtPayload) {
    // Lấy secret từ biến môi trường hoặc dùng mặc định
    const accessTokenSecret = this.configService.get<string>('JWT_SECRET') || 'your-super-secret-key';
    const refreshTokenSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'your-refresh-secret-key';

    // Tạo song song 2 token để tiết kiệm thời gian chờ
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessTokenSecret,
        expiresIn: '1h', // access_token hết hạn sau 1 giờ
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshTokenSecret,
        expiresIn: '7d', // refresh_token hết hạn sau 7 ngày
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * Xác thực refresh token (để cấp lại access token mới)
   */
  async verifyRefreshToken(token: string) {
    const refreshTokenSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'your-refresh-secret-key';
    return await this.jwtService.verifyAsync(token, {
      secret: refreshTokenSecret,
    });
  }
}
