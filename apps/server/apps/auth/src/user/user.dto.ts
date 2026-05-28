import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  Matches,
  IsInt,
  Min,
  IsEmail,
  MinLength,
} from 'class-validator';

export class UpdateSettingRequest {
  @ApiProperty({ example: '09:00', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'startTime must be HH:MM' })
  startTime?: string;

  @ApiProperty({ example: '23:59', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'endTime must be HH:MM' })
  endTime?: string;

  @ApiProperty({ example: 15, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  minDuration?: number;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  timeBuffer?: number;
}

export class UpdateUserRequest {
  @ApiProperty({ example: 'johndoe@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'johndoe', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'newpassword', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'refresh_token_here', required: false })
  @IsOptional()
  @IsString()
  googleRefreshToken?: string;

  @ApiProperty({ example: 'google-id-123', required: false })
  @IsOptional()
  @IsString()
  googleId?: string;
}
