import argon2 from "argon2";
import { randomBytes } from "crypto";
export const hashPassword = async (password: string) => {
    return argon2.hash(password);
};

export const checkPasswordHash = async (password: string, hashed: string) => {
    return argon2.verify(hashed, password);
};

export const makeRefreshToken = async () => {
    return randomBytes(32).toString("hex");
};
