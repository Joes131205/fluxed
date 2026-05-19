import {
  IsOptional,
  IsString,
  IsNumber,
  IsEmail,
  IsInt,
  Min,
} from 'class-validator';

export class TimeRequest {
  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;

  @IsInt()
  @Min(0)
  minDuration!: number;

  @IsInt()
  @Min(0)
  timeBuffer!: number;
}

export class UpdateUserRequest {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  googleRefreshToken?: string | null;

  @IsOptional()
  @IsString()
  googleId?: string | null;
}
