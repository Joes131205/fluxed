import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlannedSessionInput } from './dto/planned-session.dto';
import { PrismaService } from './prisma/prisma.service';

type CategoryRecord = {
  id: string;
  name: string;
  color?: string;
  weight?: number;
};

type CategoryListResponse<T> = {
  ok: boolean;
  data: T[];
};

@Injectable()
export class PlannedSessionService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private getCategoryBaseUrl() {
    return (
      this.configService.get<string>('CATEGORY_SERVICE_URL') ||
      'http://localhost:3003'
    );
  }

  private async fetchCategoryList<T>(path: string, authorization?: string) {
    const response = await fetch(`${this.getCategoryBaseUrl()}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authorization ? { Authorization: authorization } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${path} from category service: ${response.status}`,
      );
    }

    return (await response.json()) as CategoryListResponse<T>;
  }

  async getPlan(userId: string, authorization?: string) {
    const [sessions, areasResponse] = await Promise.all([
      this.prisma.plannedSession.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          startTime: 'asc',
        },
      }),
      this.fetchCategoryList<CategoryRecord>('/areas', authorization),
    ]);

    const areas = areasResponse.data.filter((area) => area.id && area.name);
    const subareaLists = await Promise.all(
      areas.map(async (area) => {
        const response = await this.fetchCategoryList<CategoryRecord>(
          `/subareas/${area.id}`,
          authorization,
        );

        return response.data.map((subarea) => ({
          ...subarea,
          areaId: area.id,
        }));
      }),
    );
    const subareas = subareaLists.flat();

    const areaById = new Map(areas.map((area) => [area.id, area]));
    const subareaById = new Map(
      subareas.map((subarea) => [subarea.id, subarea]),
    );

    return sessions.map((session) => {
      const subarea = subareaById.get(session.subareaId);
      const area = subarea ? areaById.get(subarea.areaId) : undefined;

      return {
        id: session.id,
        sessionId: session.id,
        subareaId: session.subareaId,
        subareaName: subarea?.name ?? '',
        subareaWeight: subarea?.weight ?? null,
        subareaColor: subarea?.color,
        areaName: area?.name ?? '',
        areaColor: area?.color,
        startTime: session.startTime,
        endTime: session.endTime,
        minutes: session.minutes,
      };
    });
  }

  async updatePlan(sessions: PlannedSessionInput[]) {
    if (!sessions || sessions.length === 0) {
      return { count: 0 };
    }

    const userId = sessions[0].user_id;

    await this.prisma.plannedSession.deleteMany({
      where: { userId },
    });

    const createData = sessions.map((s) => ({
      subareaId: s.subarea_id,
      userId: s.user_id,
      startTime: new Date(s.start_time),
      endTime: new Date(s.end_time),
      minutes: s.minutes,
    }));

    return await this.prisma.plannedSession.createMany({
      data: createData,
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
