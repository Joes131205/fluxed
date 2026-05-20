import { Delete, Get, Module, Post, Put } from '@nestjs/common';
import { SubareasService } from './subareas.service';
import { SubareasController } from './subareas.controller';

@Module({
  controllers: [SubareasController],
  providers: [SubareasService],
})
export class SubareasModule {
  @Get('/:id')
  getSubareaByArea() {}

  @Post('/')
  createSubarea() {}

  @Put('/:id')
  updateSubarea() {}

  @Delete('/:id')
  deleteSubarea() {}
}
