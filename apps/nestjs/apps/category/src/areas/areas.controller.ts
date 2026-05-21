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
import { AreasService } from './areas.service';
import { JwtAuthGuard } from 'packages/shared/guard/jwt.guard';
import { CreateAreaRequest, UpdateAreaRequest } from '../dto/areas.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get('/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getAreasByUser(@Req() req) {
    try {
      const data = await this.areasService.getAreasByUser(req.userId);
      return { ok: true, data };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Post('/')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createArea(@Req() req, @Body() body: CreateAreaRequest) {
    try {
      const data = await this.areasService.createArea(req.userId, body);
      return { ok: true, data };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Put('/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateArea(
    @Param('id') id: string,
    @Req() req,
    @Body() body: UpdateAreaRequest,
  ) {
    try {
      const data = await this.areasService.updateArea(req.userId, id, body);
      return { ok: true, data };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async deleteArea(@Param('id') id: string) {
    try {
      await this.areasService.deleteArea(id);
      return { ok: true };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }
}
