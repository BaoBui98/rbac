import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user', example: 'test' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'The email of the user', example: 'test@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ description: 'The password of the user', example: 'test' })
  @IsNotEmpty()
  @IsString()

  @MaxLength(255)
  password: string;

  @ApiPropertyOptional({ description: 'The role ID of the user', example: 'uuid-role' })
  @IsOptional()
  @IsString()
  roleId?: string;
}
