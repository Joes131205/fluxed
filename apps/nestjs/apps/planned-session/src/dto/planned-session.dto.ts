import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsInt,
  Min,
  IsDateString,
  ValidateNested,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PlannedSessionInput {
  @ApiProperty({ example: 'a1b2c3d4-...-uuid' })
  @IsUUID()
  subarea_id!: string;

  @ApiProperty({ example: 'user-uuid-1234' })
  @IsUUID()
  user_id!: string;

  @ApiProperty({ example: '2026-05-22T09:00:00.000Z' })
  @IsDateString()
  start_time!: string;

  @ApiProperty({ example: '2026-05-22T09:30:00.000Z' })
  @IsDateString()
  end_time!: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(0)
  minutes!: number;
}

export class UpdatePlannedSessionRequest {
  @ApiProperty({ type: [PlannedSessionInput] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PlannedSessionInput)
  sessions!: PlannedSessionInput[];
}
