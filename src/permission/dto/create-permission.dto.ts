import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'The name of the permission', example: 'create:users' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
