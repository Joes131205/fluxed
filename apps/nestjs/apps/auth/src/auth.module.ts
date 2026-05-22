import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'packages/shared/strategy/jwt.strategy';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), 'apps/nestjs/apps/auth/.env'),
        join(process.cwd(), 'apps/auth/.env'),
      ],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService) => ({
        secret: configService.get('JWT_SECRET') || 'default_secret',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [PrismaService],
})
export class AuthModule {}
