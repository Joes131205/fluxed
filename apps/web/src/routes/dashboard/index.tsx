import AreaList from "@/components/area/AreaList";
import { AreaSection } from "@/components/dashboard/AreaSection";
import { PlanSection } from "@/components/dashboard/PlanSection";
import { Button } from "@/components/misc/Button";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = useAuth();
    return (
        <main className="flex-1 bg-background p-6 lg:p-12 pb-32 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black">
                        Hello, {user?.username?.toUpperCase()}!
                    </h1>
                </div>
            </header>

            <PlanSection />
            <AreaSection />
        </main>
    );
}
