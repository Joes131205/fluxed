import { z } from "zod";

export const signUpSchema = z.object({
    email: z.email(),
    username: z.string().nonempty(),
    password: z.string().min(8),
});

export const logInSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

export const areaSchema = z.object({
    id: z.string(),
    name: z.string().nonempty(),
    weight: z.number().default(0),
});

export const subareaSchema = z.object({
    id: z.string().optional(),
    area_id: z.string().optional(),
    name: z.string().optional(),
    weight: z.number().default(0).optional(),
    allocatedMinutes: z.number().optional(),
});

export const eventSchema = z.object({
    subarea_id: z.string().nonempty(),
    name: z.string(),
    description: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    isHardLocked: z.boolean().default(false),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LogInInput = z.infer<typeof logInSchema>;
export type AreaInput = z.infer<typeof areaSchema>;
export type SubareaInput = z.infer<typeof subareaSchema>;
export type eventInput = z.infer<typeof eventSchema>;
