import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'The name of the role', example: 'admin' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'List of inherited role names', example: ['user'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  inherit?: string[];

}
