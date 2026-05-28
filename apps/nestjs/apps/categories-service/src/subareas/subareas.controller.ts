import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubareasService } from './subareas.service';
import { CreateSubareaDto } from './dto/create-subarea.dto';
import { UpdateSubareaDto } from './dto/update-subarea.dto';

@Controller()
export class SubareasController {
  constructor(private readonly subareasService: SubareasService) {}

  @MessagePattern('createSubarea')
  create(@Payload() createSubareaDto: CreateSubareaDto) {
    return this.subareasService.create(createSubareaDto);
  }

  @MessagePattern('findAllSubareas')
  findAll() {
    return this.subareasService.findAll();
  }

  @MessagePattern('findOneSubarea')
  findOne(@Payload() id: number) {
    return this.subareasService.findOne(id);
  }

  @MessagePattern('updateSubarea')
  update(@Payload() updateSubareaDto: UpdateSubareaDto) {
    return this.subareasService.update(updateSubareaDto.id, updateSubareaDto);
  }

  @MessagePattern('removeSubarea')
  remove(@Payload() id: number) {
    return this.subareasService.remove(id);
  }
}
