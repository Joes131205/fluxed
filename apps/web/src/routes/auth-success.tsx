import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import z from "zod";

const tokenSchema = z.object({
    token: z.string().min(1),
});

export const Route = createFileRoute("/auth-success")({
    component: RouteComponent,
    validateSearch: tokenSchema,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { token } = Route.useSearch();

    useEffect(() => {
        localStorage.setItem("token", token);
        navigate({ to: "/dashboard", replace: true });
    }, [token, navigate]);

    return (
        <div>
            <p>Signing in...</p>
        </div>
    );
}
