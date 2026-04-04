import { PlanSection } from "@/components/dashboard/PlanSection";
import { Button } from "@/components/misc/Button";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <main className="flex-1 bg-background p-6 lg:p-12 pb-32 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black">
                        Hello, {user?.username?.toUpperCase()}!
                    </h1>
                </div>
            </header>

            <div className="rounded-[2.5rem] bg-white p-6 lg:p-10 shadow-[0_40px_100px_-20px_rgba(15,23,41,0.06)] border-2 border-border/50 relative overflow-hidden">
                <div className="flex items-center justify-between mb-12 relative z-10">
                    <h2 className="text-2xl font-black tracking-tight text-text">
                        Today&apos;s Plan
                    </h2>

                    <Button
                        disabled={false}
                        isSubmitting={false}
                        label={"Reschedule"}
                        onClick={() => navigate({ to: "/dashboard/calendar" })}
                    />
                </div>

                <div className="relative z-10">
                    <PlanSection />
                </div>
            </div>
        </main>
    );
}
