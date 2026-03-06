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

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LogInInput = z.infer<typeof logInSchema>;
