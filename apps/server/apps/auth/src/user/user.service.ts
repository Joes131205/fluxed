import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateSettingRequest, UpdateUserRequest } from './user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async updateSettings(userId: string, body: UpdateSettingRequest) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: body,
    });
  }

  async updateUser(userId: string, body: UpdateUserRequest) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: body,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
