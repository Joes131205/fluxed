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
  HttpCode,
} from '@nestjs/common';
import { SubareasService } from './subareas.service';
import { JwtAuthGuard } from 'packages/shared/guard/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateSubareaRequest,
  UpdateSubareaRequest,
} from '../dto/subareas.dto';

@ApiTags('Subareas')
@ApiBearerAuth()
@Controller('subareas')
export class SubareasController {
  constructor(private readonly subareasService: SubareasService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get subareas for a given area id' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getSubareaByArea(@Param('id') id: string) {
    try {
      const data = await this.subareasService.getSubareaByArea(id);
      return { ok: true, data };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a new subarea under an area' })
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createSubarea(@Req() req, @Body() body: CreateSubareaRequest) {
    try {
      const data = await this.subareasService.createSubarea(
        req.user.userId,
        body,
      );
      return { ok: true, data };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a subarea by id' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateSubarea(
    @Param('id') id: string,
    @Body() body: UpdateSubareaRequest,
  ) {
    try {
      const data = await this.subareasService.updateSubarea(id, body);
      return { ok: true, data };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a subarea by id' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async deleteSubarea(@Param('id') id: string) {
    try {
      await this.subareasService.deleteSubarea(id);
      return { ok: true };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }
}
