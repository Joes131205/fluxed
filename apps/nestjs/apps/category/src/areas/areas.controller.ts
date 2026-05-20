import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { AreasService } from './areas.service';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get('/')
  getAreasByUser() {
    try {
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Post('/')
  createArea() {
    try {
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Put('/:id')
  updateArea() {
    try {
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Delete('/:id')
  deleteArea() {
    try {
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }
}
