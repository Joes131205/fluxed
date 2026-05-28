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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdatePlannedSessionRequest } from './dto/planned-session.dto';

@ApiTags('Planned Sessions')
@ApiBearerAuth()
@Controller('planned-sessions')
export class PlannedSessionController {
  constructor(private readonly plannedSessionService: PlannedSessionService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get currently saved planned sessions for the authenticated user',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getPlan(@Req() req) {
    const data = await this.plannedSessionService.getPlan(
      req.user.userId,
      req.headers.authorization,
    );
    return { ok: true, data };
  }

  @Post('/')
  @ApiOperation({
    summary: 'Create or update planned sessions for the authenticated user',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updatePlan(@Body() body: UpdatePlannedSessionRequest, @Req() req) {
    await this.plannedSessionService.updatePlan(body.sessions);
    return { ok: true };
  }

  @Delete('/')
  @ApiOperation({
    summary: 'Delete all planned sessions for the authenticated user',
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async deletePlan(@Req() req) {
    await this.plannedSessionService.deletePlan(req.user.userId);
    return { ok: true };
  }
}
