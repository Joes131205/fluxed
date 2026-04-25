import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export const makeJWT = (userId: string, expiresIn: number, secret: string) => {
    const iat = Math.floor(Date.now() / 1000);
    const payload: Payload = {
        iss: "app",
        sub: userId,
        iat,
        exp: iat + expiresIn,
    };
    return jwt.sign(payload, secret);
};

export const validateJWT = (tokenString: string, secret: string) => {
    const decoded = jwt.verify(tokenString, secret) as JwtPayload;
    if (!decoded.sub) {
        throw new Error("Invalid token");
    }
    return decoded.sub;
};
