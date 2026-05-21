import {
  Controller,
  Delete,
  Get,
  Post,
  BadRequestException,
  UseGuards,
  Req,
  Body,
  HttpCode,
} from '@nestjs/common';
import { PlannedSessionService } from './planned-session.service';
import { JwtAuthGuard } from 'packages/shared/guard/jwt.guard';
import { UpdatePlannedSessionRequest } from './dto/planned-session.dto';

@Controller('planned-sessions')
export class PlannedSessionController {
  constructor(private readonly plannedSessionService: PlannedSessionService) {}

  @Get('/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getPlan(@Req() req) {
    try {
      const data = await this.plannedSessionService.getPlan(req.userId);
      return { ok: true, data };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Post('/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updatePlan(@Body() body: UpdatePlannedSessionRequest, @Req() req) {
    try {
      await this.plannedSessionService.updatePlan(body.sessions);
      return { ok: true };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Delete('/')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async deletePlan(@Req() req) {
    try {
      await this.plannedSessionService.deletePlan(req.userId);
      return { ok: true };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }
}
