// User types
export interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    username: string;
    password: string;
    startTime: string;
    endTime: string;
}

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
    name: string;
    weight: number | null;
    allocatedMinutes: number;
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
