export class TimeRequest {
  startTime!: string;
  endTime!: string;
  minDuration!: number;
  timeBuffer!: number;
}

export class UpdateUserRequest {
  email!: string;
  username!: string;
  password!: string;
  googleRefreshToken!: string;
  googleId!: string;
}
