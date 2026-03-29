import { useState } from "react";

export const BusyTimeSection = ({ user, calendar, onAdd, onRemove }: any) => {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const isGoogle = !!user?.googleId;
    const formatTime = (isoDate: string) => {
        return new Date(isoDate).toLocaleTimeString([], {
            hour: "2-digit",

            minute: "2-digit",
        });
    };
    return (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold">
                {isGoogle ? "Today's Busy Times" : "Manual Busy Blocks"}
            </h2>

            {!isGoogle && (
                <div className="grid gap-3 sm:grid-cols-3 mb-6">
                    <input
                        type="time"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="..."
                    />
                    <input
                        type="time"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="..."
                    />
                    <button
                        onClick={() => {
                            onAdd(start, end);
                            setStart("");
                            setEnd("");
                        }}
                        className="..."
                    >
                        Add Event
                    </button>
                </div>
            )}

            <div className="space-y-3">
                {calendar.map((item: any) => (
                    <div
                        key={item.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                        <h3 className="font-semibold">{item.name}</h3>
                        <ul className="grid gap-2 sm:grid-cols-2 mt-2">
                            {item.busy.map((slot: any, i: number) => (
                                <li
                                    key={i}
                                    onClick={() => !isGoogle && onRemove(i)}
                                    className="cursor-pointer ..."
                                >
                                    {formatTime(slot.start)} -{" "}
                                    {formatTime(slot.end)}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
