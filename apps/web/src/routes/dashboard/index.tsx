import { AreaSection } from "@/components/dashboard/AreaSection";
import { PlanSection } from "@/components/dashboard/PlanSection";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <main className="flex-1">
            <div className="rounded-[2.5rem] bg-white p-6 lg:p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.04)] border border-border/50 min-h-full">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">
                            Today&apos;s Plan
                        </h2>
                    </div>
                    <button className="bg-primary text-background px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95">
                        Reschedule
                    </button>
                </div>

                <PlanSection />
            </div>
        </main>
    );
}
