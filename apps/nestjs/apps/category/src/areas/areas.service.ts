import { Injectable } from '@nestjs/common';
import { CreateAreaRequest, UpdateAreaRequest } from '../dto/areas.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}
  async getAreasByUser(userId: string) {
    return await this.prisma.area.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async createArea(userId: string, body: CreateAreaRequest) {
    return await this.prisma.area.create({
      data: {
        userId,
        name: body.name,
        color: body.color,
        weight: Number(body.weight),
      },
    });
  }

  async updateArea(userId: string, areaId: string, body: UpdateAreaRequest) {
    return await this.prisma.area.update({
      data: {
        name: body.name,
        color: body.color,
        weight: Number(body.weight),
      },
      where: {
        id: areaId,
      },
    });
  }

  async deleteArea(areaId: string) {
    await this.prisma.area.delete({
      where: {
        id: areaId,
      },
    });
  }
}
