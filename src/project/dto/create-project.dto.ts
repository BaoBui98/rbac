import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsInt, IsUUID, IsObject } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  team_size?: number;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  mentorId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  level?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  review?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  link?: Record<string, string>;
}
