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
import { AreasService } from './areas.service';
import { JwtAuthGuard } from 'packages/shared/guard/jwt.guard';
import { CreateAreaRequest, UpdateAreaRequest } from '../dto/areas.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getAreasByUser(@Req() req) {
    try {
      return this.areasService.getAreasByUser(req.userId);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  createArea(@Req() req, @Body() body: CreateAreaRequest) {
    try {
      return this.areasService.createArea(req.userId, body);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  updateArea(
    @Param('id') id: string,
    @Req() req,
    @Body() body: UpdateAreaRequest,
  ) {
    try {
      return this.areasService.updateArea(req.userId, id, body);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteArea(@Param('id') id: string) {
    try {
      return this.areasService.deleteArea(id);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }
}
