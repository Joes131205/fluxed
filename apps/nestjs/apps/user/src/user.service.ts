import { Injectable } from '@nestjs/common';
import { UpdateSettingRequest, UpdateUserRequest } from './dto/user.dto';

@Injectable()
export class UserService {
  async updateSettings(userId: string, body: UpdateSettingRequest) {}
  async updateUser(userId: string, body: UpdateUserRequest) {}
}
