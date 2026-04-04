import { CreateArea } from "@/components/categories/CreateArea";
import { CreateSubarea } from "@/components/categories/CreateSubarea";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/categories")({
    component: RouteComponent,
});

function RouteComponent() {
    const [currentSection, setCurrentSection] = useState<"areas" | "subareas">(
        "areas",
    );

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="rounded-3xl border border-border/60 bg-white p-2 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.25)]">
                <div
                    className="flex items-center gap-2"
                    role="tablist"
                    aria-label="Category section switcher"
                >
                    <button
                        type="button"
                        onClick={() => setCurrentSection("areas")}
                        aria-pressed={currentSection === "areas"}
                        className={`flex-1 cursor-pointer rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                            currentSection === "areas"
                                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "border-transparent text-foreground/70 hover:border-border hover:bg-muted hover:text-foreground"
                        }`}
                    >
                        Areas
                    </button>
                    <div
                        className="pointer-events-none flex items-center justify-center px-1 text-foreground/35"
                        aria-hidden="true"
                    >
                        <ArrowRight className="h-4 w-4" />
                    </div>
                    <button
                        type="button"
                        onClick={() => setCurrentSection("subareas")}
                        aria-pressed={currentSection === "subareas"}
                        className={`flex-1 cursor-pointer rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                            currentSection === "subareas"
                                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "border-transparent text-foreground/70 hover:border-border hover:bg-muted hover:text-foreground"
                        }`}
                    >
                        Subareas
                    </button>
                </div>
            </div>
            <div>
                {currentSection === "areas" ? (
                    <CreateArea />
                ) : (
                    <CreateSubarea />
                )}
            </div>
        </div>
    );
}
