import axios from "axios";
import { googleClientId, googleClientSecret } from "../env";

export const refreshGoogleToken = async (refreshToken: string) => {
    try {
        const response = await axios.post(
            "https://oauth2.googleapis.com/token",
            null,
            {
                params: {
                    client_id: googleClientId,
                    client_secret: googleClientSecret,
                    refresh_token: refreshToken,
                    grant_type: "refresh_token",
                },
            },
        );

        return response.data.access_token as string;
    } catch (error) {
        console.error("Failed to refresh token", error);
        throw new Error("Could not refresh Google token");
    }
};
