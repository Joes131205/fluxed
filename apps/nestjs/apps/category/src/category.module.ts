import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'packages/shared/strategy/jwt.strategy';
import { AreasModule } from './areas/areas.module';
import { SubareasModule } from './subareas/subareas.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1d' },
    }),
    AreasModule,
    SubareasModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, JwtStrategy, PrismaService],
  exports: [PrismaService],
})
export class CategoryModule {}
