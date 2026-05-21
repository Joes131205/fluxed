import {
  Controller,
  Delete,
  Get,
  Post,
  BadRequestException,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { PlannedSessionService } from './planned-session.service';
import { JwtAuthGuard } from 'packages/shared/guard/jwt.guard';
import { UpdatePlannedSessionRequest } from './dto/planned-session.dto';

@Controller('planned-sessions')
export class PlannedSessionController {
  constructor(private readonly plannedSessionService: PlannedSessionService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getPlan(@Req() req) {
    try {
      return this.plannedSessionService.getPlan(req.userId);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  updatePlan(@Body() body: UpdatePlannedSessionRequest, @Req() req) {
    try {
      return this.plannedSessionService.updatePlan(body.sessions);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Delete('/')
  @UseGuards(JwtAuthGuard)
  deletePlan(@Req() req) {
    try {
      return this.plannedSessionService.deletePlan(req.userId);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }
}
