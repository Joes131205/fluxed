export class CreateSubareaRequest {
  area_id!: string;
  name!: string;
  weight?: number;
  color!: string;
  allocatedMinutes?: number;
}

export class UpdateSubareaRequest {
  name?: string;
  weight?: number;
  color?: string;
  allocatedMinutes?: number;
}
