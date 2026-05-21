import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'packages/shared/strategy/jwt.strategy';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [PrismaService],
})
export class AuthModule {}
