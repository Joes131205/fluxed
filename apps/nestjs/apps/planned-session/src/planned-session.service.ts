import { Injectable } from '@nestjs/common';
import { PlannedSessionInput } from './dto/planned-session.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class PlannedSessionService {
  constructor(private prisma: PrismaService) {}

  async getPlan(userId: string) {
    return await this.prisma.plannedSession.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async updatePlan(sessions: PlannedSessionInput[]) {
    return await this.prisma.plannedSession.updateMany({
      data: sessions,
    });
  }

  async deletePlan(userId: string) {
    await this.prisma.plannedSession.deleteMany({
      where: {
        userId: userId,
      },
    });
  }
}
