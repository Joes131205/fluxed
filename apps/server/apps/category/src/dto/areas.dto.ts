import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateAreaRequest {
  @ApiProperty({ example: 'Work' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  weight!: number;

  @ApiProperty({ example: '#FF5733' })
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  color!: string;
}

export class UpdateAreaRequest {
  @ApiProperty({ example: 'Work', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  weight?: number;

  @ApiProperty({ example: '#FF5733', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  color?: string;
}
