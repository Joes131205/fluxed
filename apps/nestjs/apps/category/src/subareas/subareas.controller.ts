import { Controller } from '@nestjs/common';
import { SubareasService } from './subareas.service';

@Controller('subareas')
export class SubareasController {
  constructor(private readonly subareasService: SubareasService) {}
}
