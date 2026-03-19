import axios from "axios";
import { Hono } from "hono";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>().get(
    "/:accessToken",
    async (c) => {
        const accessToken = c.req.param("accessToken");

        const now = new Date();
        const night = new Date();

        night.setHours(24, 0, 0, 0);

        const response = await axios.post(
            "https://www.googleapis.com/calendar/v3/freeBusy",
            {
                timeMin: now.toISOString(),
                timeMax: night.toISOString(),
                items: [{ id: "primary" }],
            },
            {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
            },
        );

        const data = response.data;
    },
);

export default app;
