import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/reschedule/")({
    component: RouteComponent,
});

const mockData = [
    {
        areaName: "Work",
        weight: 5,
        subareas: [
            {
                subareaName: "Development",
                weight: 4,
                events: [
                    {
                        name: "Code Review",
                        description: "Review PR #1234",
                        startTime: new Date("2024-03-11T09:00:00"),
                        endTime: new Date("2024-03-11T09:30:00"),
                        isHardLocked: false,
                    },
                    {
                        name: "Team Meeting",
                        description: "Sprint planning",
                        startTime: new Date("2024-03-11T10:00:00"),
                        endTime: new Date("2024-03-11T11:00:00"),
                        isHardLocked: true,
                    },
                ],
            },
            {
                subareaName: "Design",
                weight: 2,
                events: [
                    {
                        name: "Design System Update",
                        description: null,
                        startTime: new Date("2024-03-11T14:00:00"),
                        endTime: new Date("2024-03-11T15:00:00"),
                        isHardLocked: false,
                    },
                ],
            },
        ],
    },
    {
        areaName: "Health",
        weight: 4,
        subareas: [
            {
                subareaName: "Exercise",
                weight: 3,
                events: [
                    {
                        name: "Gym",
                        description: "Chest & Back",
                        startTime: new Date("2024-03-11T06:00:00"),
                        endTime: new Date("2024-03-11T07:00:00"),
                        isHardLocked: false,
                    },
                ],
            },
            {
                subareaName: "Sleep",
                weight: 5,
                events: [],
            },
        ],
    },
    {
        areaName: "Personal",
        weight: 3,
        subareas: [
            {
                subareaName: "Learning",
                weight: 3,
                events: [
                    {
                        name: "Read Book",
                        description: "Atomic Habits",
                        startTime: new Date("2024-03-11T19:00:00"),
                        endTime: new Date("2024-03-11T20:00:00"),
                        isHardLocked: false,
                    },
                ],
            },
            {
                subareaName: "Social",
                weight: 2,
                events: [],
            },
        ],
    },
];

function RouteComponent() {
    const [minutes, setMinutes] = useState<number>(0);
    return (
        <div>
            <p>Is your structure derailed?</p>
            <p>Don't fret! We gotchu fam!</p>
            <p>Using a mock data for now...</p>
            <div>
                <label htmlFor="minutes">How many minutes you have left?</label>
                <input
                    type="number"
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    value={minutes}
                />
            </div>
            <button>Reschedule</button>
        </div>
    );
}
