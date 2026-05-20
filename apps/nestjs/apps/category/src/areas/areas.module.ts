import { Delete, Get, Module, Post, Put } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';

@Module({
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}
