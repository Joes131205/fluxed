import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateSubareaRequest {
  @ApiProperty({ example: 'a1b2c3d4-...-uuid' })
  @IsUUID()
  area_id!: string;

  @ApiProperty({ example: 'Emails' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  weight?: number;

  @ApiProperty({ example: '#33AAFF' })
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  color!: string;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  allocatedMinutes?: number;
}

export class UpdateSubareaRequest {
  @ApiProperty({ example: 'Emails', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  weight?: number;

  @ApiProperty({ example: '#33AAFF', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  color?: string;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  allocatedMinutes?: number;
}
