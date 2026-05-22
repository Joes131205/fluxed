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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Areas')
@ApiBearerAuth()
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all areas for the authenticated user' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getAreasByUser(@Req() req) {
    const data = await this.areasService.getAreasByUser(req.user.userId);
    return { ok: true, data };
  }

  @Post('/')
  @ApiOperation({ summary: 'Create a new area for the authenticated user' })
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createArea(@Req() req, @Body() body: CreateAreaRequest) {
    const data = await this.areasService.createArea(req.user.userId, body);
    return { ok: true, data };
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update an area owned by the authenticated user' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateArea(
    @Param('id') id: string,
    @Req() req,
    @Body() body: UpdateAreaRequest,
  ) {
    const data = await this.areasService.updateArea(req.user.userId, id, body);
    return { ok: true, data };
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete an area by id' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async deleteArea(@Param('id') id: string) {
    await this.areasService.deleteArea(id);
    return { ok: true };
  }
}
