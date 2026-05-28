import { Injectable } from '@nestjs/common';
import {
  CreateSubareaRequest,
  UpdateSubareaRequest,
} from '../dto/subareas.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubareasService {
  constructor(private prisma: PrismaService) {}
  async getSubareaByArea(areaId: string) {
    return await this.prisma.subarea.findMany({
      where: {
        areaId: areaId,
      },
    });
  }

  async createSubarea(userId: string, body: CreateSubareaRequest) {
    return await this.prisma.subarea.create({
      data: {
        areaId: body.area_id,
        userId,
        name: body.name,
        color: body.color,
        weight: Number(body.weight) || 1,
        allocatedMinutes: body.allocatedMinutes || 0,
      },
    });
  }

  async updateSubarea(subareaId: string, body: UpdateSubareaRequest) {
    return await this.prisma.subarea.update({
      data: body,
      where: {
        id: subareaId,
      },
    });
  }

  async deleteSubarea(subareaId: string) {
    await this.prisma.subarea.delete({
      where: {
        id: subareaId,
      },
    });
  }
}
