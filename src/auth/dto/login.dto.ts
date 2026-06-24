import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@admin.com', description: 'Địa chỉ email người dùng' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @ApiProperty({ example: 'Admin@123', description: 'Mật khẩu người dùng' })

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })

  password!: string;
}
