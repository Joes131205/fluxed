import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { PlannedSessionController } from './planned-session.controller';
import { PlannedSessionService } from './planned-session.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'packages/shared/strategy/jwt.strategy';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), 'apps/nestjs/apps/planned-session/.env'),
        join(process.cwd(), 'apps/planned-session/.env'),
      ],
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService) => ({
        secret: configService.get('JWT_SECRET') || 'default_secret',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PlannedSessionController],
  providers: [PlannedSessionService, JwtStrategy, PrismaService],
  exports: [PrismaService],
})
export class PlannedSessionModule {}
