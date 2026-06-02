import type { MiddlewareHandler } from "hono";

export const withRouteError: MiddlewareHandler = async (c, next) => {
    try {
        await next();
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Internal Server Error";

        return c.json({ ok: false, message }, 500);
    }
};
