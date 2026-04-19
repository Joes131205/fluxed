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

const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, {
    message: "Color must be a 6-digit hex value like #00cdfd",
});

export const areaSchema = z.object({
    id: z.string().optional(),
    name: z.string().nonempty(),
    weight: z.number().default(0),
    color: hexColorSchema.default("#00cdfd"),
});

const hhmmSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Time must be in HH:mm format",
});

const hhmmOrHhmmssSchema = z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
        message: "Time must be in HH:mm or HH:mm:ss format",
    });

const toMinutes = (value: string) => {
    const [hours = 0, minutes = 0] = value.split(":").map(Number);
    return hours * 60 + minutes;
};

export const timeSchema = z
    .object({
        startTime: hhmmOrHhmmssSchema.default("09:00:00"),
        endTime: hhmmOrHhmmssSchema.default("24:00:00"),
        minDuration: z.number(),
        timeBuffer: z.number(),
    })
    .refine((value) => toMinutes(value.endTime) > toMinutes(value.startTime), {
        message: "endTime must be after startTime",
        path: ["endTime"],
    });

export const subareaSchema = z.object({
    user_id: z.string().optional(),
    id: z.string().optional(),
    area_id: z.string().optional(),
    name: z.string().optional(),
    weight: z.number().default(0).optional(),
    color: hexColorSchema.default("#00cdfd"),
    allocatedMinutes: z.number().optional(),
});

export const plannedSessionSchema = z.array(
    z.object({
        subarea_id: z.string(),
        user_id: z.string(),
        start_time: z.coerce.date(),
        end_time: z.coerce.date(),
        minutes: z.number(),
    }),
);

export const userSchema = z.object({
    id: z.string().uuid(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    email: z.email(),
    username: z.string().nonempty(),
    password: z.string().min(8).nullable().optional(),
    googleRefreshToken: z.string().nullable().optional(),
    googleId: z.string().nullable().optional(),
    startTime: hhmmOrHhmmssSchema,
    endTime: hhmmOrHhmmssSchema,
});

export const publicUserSchema = userSchema.omit({
    password: true,
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LogInInput = z.infer<typeof logInSchema>;
export type AreaInput = z.infer<typeof areaSchema>;
export type TimeInput = z.infer<typeof timeSchema>;
export type SubareaInput = z.infer<typeof subareaSchema>;
export type PlannedSessionInput = z.infer<typeof plannedSessionSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type PublicUserInput = z.infer<typeof publicUserSchema>;
