import { SideBar } from "@/components/dashboard/SideBar";
import { requireAuth } from "@/utils/requireAuth";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="min-h-screen md:flex">
            <SideBar />
            <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
                <Outlet />
            </main>
        </div>
    );
}
