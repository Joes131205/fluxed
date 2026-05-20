import { Module } from '@nestjs/common';
import { PlannedSessionController } from './planned-session.controller';
import { PlannedSessionService } from './planned-session.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'packages/shared/strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [PlannedSessionController],
  providers: [PlannedSessionService, JwtStrategy],
})
export class PlannedSessionModule {}
