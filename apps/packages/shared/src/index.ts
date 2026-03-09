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
    name: z.string().nonempty(),
    weight: z.number().default(0),
});

export const subareaSchema = z.object({
    area_id: z.string().nonempty(),
    name: z.string().nonempty(),
    weight: z.number().default(0),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LogInInput = z.infer<typeof logInSchema>;
export type AreaInput = z.infer<typeof areaSchema>;
export type SubareaInput = z.infer<typeof subareaSchema>;
