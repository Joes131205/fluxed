import { Module } from '@nestjs/common';
import { SubareasService } from './subareas.service';
import { SubareasController } from './subareas.controller';

@Module({
  controllers: [SubareasController],
  providers: [SubareasService],
})
export class SubareasModule {}
