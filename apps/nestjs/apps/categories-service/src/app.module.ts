import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AreasModule } from './areas/areas.module';
import { SubareasModule } from './subareas/subareas.module';
import { AreasModule } from './areas/areas.module';
import { SubareasModule } from './subareas/subareas.module';

@Module({
  imports: [AreasModule, SubareasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
