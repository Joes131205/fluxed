import {
  Controller,
  Delete,
  Get,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { PlannedSessionService } from './planned-session.service';

@Controller('planned-sessions')
export class PlannedSessionController {
  constructor(private readonly plannedSessionService: PlannedSessionService) {}

  @Get('/')
  getPlan() {
    try {
      return this.plannedSessionService.getPlan();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Post('/')
  updatePlan() {
    try {
      return this.plannedSessionService.updatePlan();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }

  @Delete('/')
  deletePlan() {
    try {
      return this.plannedSessionService.deletePlan();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Server Error');
    }
  }
}
