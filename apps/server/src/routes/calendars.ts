import axios from "axios";
import { Hono } from "hono";
import { authCheck } from "../middlewares/authMiddleware";
import { getUserById } from "../../../packages/db/src/queries/users";
import { googleClientId, googleClientSecret, googleRedirectURI } from "../env";

type AppType = {
    userId: string;
};

const app = new Hono<{ Variables: AppType }>().get(
    "/sync",
    authCheck,
    async (c) => {
        const userId = c.get("userId");
        const user = await getUserById(userId);
        console.log(user);
        if (!user) {
            return c.json({ ok: false, error: "User not found" }, 401);
        }

        const now = new Date();
        const night = new Date();

        night.setHours(24, 0, 0, 0);

        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
                client_id: googleClientId,
                client_secret: googleClientSecret,
                refresh_token: user.googleRefreshToken,
                grant_type: "refresh_token",
            },
        );
        const accessToken = tokenResponse.data.access_token;

        const listRes = await axios.get(
            "https://www.googleapis.com/calendar/v3/users/me/calendarList",
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            },
        );

        const calendarList = listRes.data.items.filter((item: any) => {
            const isEditable =
                item.accessRole === "owner" || item.accessRole === "writer";

            const isSelected = item.selected === true;

            return isEditable && isSelected;
        });
        console.log(calendarList);
        const calendarIds = calendarList.map((item: any) => ({ id: item.id }));

        const response = await axios.post(
            "https://www.googleapis.com/calendar/v3/freeBusy",
            {
                timeMin: now.toISOString(),
                timeMax: night.toISOString(),
                items: calendarIds,
            },
            {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            },
        );

        const calendars = response.data.calendars;

        const calendarNameLookup = Object.fromEntries(
            calendarList.map((cal: any) => [cal.id, cal.summary]),
        );

        const calendarData = Object.entries(calendars).map(
            ([id, details]: [string, any]) => ({
                name: calendarNameLookup[id] || "Unknown",
                id: id,
                busy: details.busy,
            }),
        );
        return c.json({ ok: true, calendarData }, 200);
    },
);

export default app;
