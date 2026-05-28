import { PartialType } from '@nestjs/mapped-types';
import { CreateSubareaDto } from './create-subarea.dto';

export class UpdateSubareaDto extends PartialType(CreateSubareaDto) {
  id: number;
}
