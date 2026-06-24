import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({ description: 'The ID of the role', example: 'uuid-role' })
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @ApiProperty({ description: 'List of permission IDs to assign to the role', example: ['uuid-1', 'uuid-2'] })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  permissionId: string[];
}
