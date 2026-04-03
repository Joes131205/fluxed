import { AreaSection } from "@/components/dashboard/AreaSection";
import { PlanSection } from "@/components/dashboard/PlanSection";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="space-y-6">
            <AreaSection />
            <PlanSection />
        </div>
    );
}
