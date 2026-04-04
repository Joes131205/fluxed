import { env } from "@/env";
import { useAuth } from "@/hooks/useAuth";
import { getAuthHeaders } from "@/lib/authHeaders";
import { usersClient } from "@/lib/client";
import { requireAuth } from "@/utils/requireAuth";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Clock3, Link2, TimerReset } from "lucide-react";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/misc/Button";

export const Route = createFileRoute("/dashboard/settings")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = useAuth();

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [minDuration, setMinDuration] = useState(0);
    const [timeBuffer, setTimeBuffer] = useState(0);

    const handleSave = async () => {
        await usersClient.time.$put(
            {
                json: {
                    startTime,
                    endTime,
                    minDuration,
                    timeBuffer,
                },
            },
            {
                headers: getAuthHeaders(),
            },
        );
    };

    useEffect(() => {
        setStartTime(user?.startTime ?? "");
        setEndTime(user?.endTime ?? "");
        setMinDuration(user?.minDuration ?? 0);
        setTimeBuffer(user?.timeBuffer ?? 0);
    }, [user]);

    const fieldClassName =
        "h-11 rounded-xl border-border bg-white text-foreground shadow-sm transition focus-visible:ring-2 focus-visible:ring-primary/30";

    return (
        <div className="p-4 md:p-6">
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        Preferences
                    </p>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">
                        Settings
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Tune your schedule defaults so planning feels automatic.
                    </p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-white to-slate-50 shadow-[0_26px_70px_-36px_rgba(15,23,42,0.28)]">
                    <form
                        className="space-y-8 p-6 md:p-8"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 rounded-2xl border border-border/50 bg-white p-4">
                                <div className="mb-1 flex items-center gap-2 text-foreground/80">
                                    <Clock3 className="h-4 w-4" />
                                    <Label
                                        htmlFor="startTime"
                                        className="font-semibold"
                                    >
                                        Start time
                                    </Label>
                                </div>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                    className={fieldClassName}
                                />
                                <span className="text-xs text-muted-foreground">
                                    Current: {startTime || "Not set"}
                                </span>
                            </div>

                            <div className="space-y-2 rounded-2xl border border-border/50 bg-white p-4">
                                <div className="mb-1 flex items-center gap-2 text-foreground/80">
                                    <CalendarClock className="h-4 w-4" />
                                    <Label
                                        htmlFor="endTime"
                                        className="font-semibold"
                                    >
                                        End time
                                    </Label>
                                </div>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className={fieldClassName}
                                />
                                <span className="text-xs text-muted-foreground">
                                    Current: {endTime || "Not set"}
                                </span>
                            </div>

                            <div className="space-y-2 rounded-2xl border border-border/50 bg-white p-4">
                                <div className="mb-1 flex items-center gap-2 text-foreground/80">
                                    <TimerReset className="h-4 w-4" />
                                    <Label
                                        htmlFor="minDuration"
                                        className="font-semibold"
                                    >
                                        Minimum task duration (minutes)
                                    </Label>
                                </div>
                                <Input
                                    id="minDuration"
                                    type="number"
                                    value={minDuration}
                                    onChange={(e) =>
                                        setMinDuration(Number(e.target.value))
                                    }
                                    min={0}
                                    className={fieldClassName}
                                />
                                <span className="text-xs text-muted-foreground">
                                    Current: {minDuration || "Not set"}
                                </span>
                            </div>

                            <div className="space-y-2 rounded-2xl border border-border/50 bg-white p-4">
                                <div className="mb-1 flex items-center gap-2 text-foreground/80">
                                    <TimerReset className="h-4 w-4" />
                                    <Label
                                        htmlFor="timeBuffer"
                                        className="font-semibold"
                                    >
                                        Buffer between events (minutes)
                                    </Label>
                                </div>
                                <Input
                                    id="timeBuffer"
                                    type="number"
                                    value={timeBuffer}
                                    onChange={(e) =>
                                        setTimeBuffer(Number(e.target.value))
                                    }
                                    min={0}
                                    className={fieldClassName}
                                />
                                <span className="text-xs text-muted-foreground">
                                    Current: {timeBuffer || "Not set"}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border/50 bg-white p-5">
                            <div className="flex items-center gap-3">
                                <Link2 className="h-4 w-4 text-foreground/70" />
                                <span className="text-sm font-semibold text-foreground/90">
                                    Google Account
                                </span>
                                {user?.googleId ? (
                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                        Linked
                                    </span>
                                ) : (
                                    <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                                        Not Linked
                                    </span>
                                )}
                            </div>
                            {user?.googleId ? (
                                <div className="mt-2 text-xs text-muted-foreground">
                                    {user.googleId}
                                </div>
                            ) : (
                                <a
                                    href={
                                        env.VITE_API_URL +
                                        "/api/auth/google/start"
                                    }
                                    className="mt-3 inline-flex items-center rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/5"
                                >
                                    Link Google
                                </a>
                            )}
                        </div>

                        <div className="flex justify-end border-t border-border/60 pt-2">
                            <Button
                                type="submit"
                                disabled={false}
                                isSubmitting={false}
                                label={"Save"}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
