// User types
export type User = {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    username: string;
    googleRefreshToken: string | null;
    googleId: string | null;
    startTime: string;
    endTime: string;
    minDuration: number | null;
    timeBuffer: number | null;
};

export type NewUser = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdateUser = Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;
export type PublicUser = Omit<User, "password">;

// Area types
export interface Area {
    id: string;
    created_at: Date;
    updated_at: Date;
    user_id: string;
    name: string;
    weight: number | null;
}

export type NewArea = Omit<Area, "id" | "created_at" | "updated_at"> & {
    weight?: number | null;
};
export type UpdateArea = Partial<
    Omit<Area, "id" | "created_at" | "updated_at" | "user_id">
>;

// Subarea types
export interface Subarea {
    id: string;
    created_at: Date;
    updated_at: Date;
    area_id: string;
    user_id: string;
    name: string;
    weight: number | null;
    allocatedMinutes: number | null;
    startTime: string | null;
    endTime: string | null;
    color: string;
}

export type NewSubarea = Omit<Subarea, "id" | "created_at" | "updated_at"> & {
    weight?: number | null;
};
export type UpdateSubarea = Partial<
    Omit<Subarea, "id" | "created_at" | "updated_at" | "area_id">
>;

// Event types
export interface Event {
    id: string;
    created_at: Date;
    updated_at: Date;
    subarea_id: string | null;
    name: string | null;
    description: string | null;
    startTime: string | null;
    endTime: string | null;
    isHardLocked: boolean | null;
}

export type NewEvent = Omit<Event, "id" | "created_at" | "updated_at">;
export type UpdateEvent = Partial<
    Omit<Event, "id" | "created_at" | "updated_at">
>;
