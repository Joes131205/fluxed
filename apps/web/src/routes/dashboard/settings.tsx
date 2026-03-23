import { requireAuth } from "@/utils/requireAuth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <h1>Settings</h1>
            <p>What is your end of day time?</p>
        </div>
    );
}
