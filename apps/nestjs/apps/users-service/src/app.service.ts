import { Injectable } from '@nestjs/common';
import { TimeRequest, UpdateUserRequest } from './dto/users.dto';
import {
  updateUser,
  updateTime,
} from '../../../../packages/db/src/queries/users';
@Injectable()
export class AppService {
  async updateSettings(userId: string, body: any) {
    return updateTime(userId, body);
  }
  async updateUser(userId: string, body: any) {
    return updateUser(userId, body);
  }
}
