export class PlannedSessionInput {
  subarea_id!: string;
  user_id!: string;
  start_time!: Date;
  end_time!: Date;
  minutes!: number;
}

export class UpdatePlannedSessionRequest {
  sessions!: PlannedSessionInput[];
}
