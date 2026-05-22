import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';
export class RegisterRequest {
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  username!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password!: string;
}

export class LoginRequest {
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password!: string;
}
