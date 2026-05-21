import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubareasService } from './subareas.service';
import { JwtAuthGuard } from 'packages/shared/guard/jwt.guard';
import {
  CreateSubareaRequest,
  UpdateSubareaRequest,
} from '../dto/subareas.dto';

@Controller('subareas')
export class SubareasController {
  constructor(private readonly subareasService: SubareasService) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getSubareaByArea(@Param('id') id: string) {
    try {
      return this.subareasService.getSubareaByArea(id);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  createSubarea(@Req() req, @Body() body: CreateSubareaRequest) {
    try {
      return this.subareasService.createSubarea(req.userId, body);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  updateSubarea(@Param('id') id: string, @Body() body: UpdateSubareaRequest) {
    try {
      return this.subareasService.updateSubarea(id, body);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteSubarea(@Param('id') id: string) {
    try {
      return this.subareasService.deleteSubarea(id);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }
}
