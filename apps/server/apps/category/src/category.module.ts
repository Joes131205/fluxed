import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'packages/shared/strategy/jwt.strategy';
import { AreasModule } from './areas/areas.module';
import { SubareasModule } from './subareas/subareas.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), 'apps/nestjs/apps/category/.env'),
        join(process.cwd(), 'apps/category/.env'),
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
    AreasModule,
    SubareasModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, JwtStrategy, PrismaService],
  exports: [PrismaService],
})
export class CategoryModule {}
