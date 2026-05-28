import { Module } from '@nestjs/common';
import { SubareasService } from './subareas.service';
import { SubareasController } from './subareas.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SubareasController],
  providers: [SubareasService, PrismaService],
})
export class SubareasModule {}
