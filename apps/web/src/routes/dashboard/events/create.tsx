import { useAreas } from "@/hooks/useAreas";
import { useCreateEvent } from "@/hooks/useEvents";
import { useSubareas } from "@/hooks/useSubareas";
import { requireAuth } from "@/utils/requireAuth";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";

export const Route = createFileRoute("/dashboard/events/create")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
    const [selectedAreaId, setSelectedAreaId] = useState("");
    const { data: areasData } = useAreas();
    const { data: subareasData } = useSubareas(selectedAreaId);
    const { mutate } = useCreateEvent();

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            subarea_id: "",
            startTime: "",
            endTime: "",
            isHardLocked: false,
        },
        validators: {
            onChange: z.object({
                name: z.string().nonempty("Required"),
                description: z.string(),
                subarea_id: z.string().nonempty("Select a subarea"),
                startTime: z.string(),
                endTime: z.string(),
                isHardLocked: z.boolean(),
            }),
        },
        onSubmit: ({ value }) => {
            mutate(value);
        },
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Create Event
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Add a new event to your schedule
                </p>

                <form
                    onSubmit={(e) => {
                        form.handleSubmit();
                        e.preventDefault();
                    }}
                    className="space-y-4"
                >
                    <form.Field name="subarea_id">
                        {(field) => (
                            <div>
                                <label
                                    htmlFor="area_id"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Area
                                </label>
                                <select
                                    id="area_id"
                                    value={selectedAreaId}
                                    onChange={(e) => {
                                        setSelectedAreaId(e.target.value);
                                        field.handleChange("");
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select an area</option>
                                    {areasData?.data?.map((area: any) => (
                                        <option key={area.id} value={area.id}>
                                            {area.name}
                                        </option>
                                    ))}
                                </select>

                                <label
                                    htmlFor="subarea_id"
                                    className="block text-sm font-medium text-gray-700 mb-1 mt-4"
                                >
                                    Subarea
                                </label>
                                <select
                                    id="subarea_id"
                                    value={field.state.value}
                                    disabled={!selectedAreaId}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    <option value="">
                                        {selectedAreaId
                                            ? "Select a subarea"
                                            : "Select an area first"}
                                    </option>
                                    {subareasData?.data?.map((subarea: any) => (
                                        <option
                                            key={subarea.id}
                                            value={subarea.id}
                                        >
                                            {subarea.name}
                                        </option>
                                    ))}
                                </select>
                                {!field.state.meta.isValid && (
                                    <p className="font-bold text-red-500 text-xs mt-1">
                                        * {field.state.meta.errors[0]?.message}
                                    </p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="name">
                        {(field) => (
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Event name"
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {!field.state.meta.isValid && (
                                    <p className="font-bold text-red-500 text-xs mt-1">
                                        * {field.state.meta.errors[0]?.message}
                                    </p>
                                )}
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="description">
                        {(field) => (
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    placeholder="Event description (optional)"
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="startTime">
                        {(field) => (
                            <div>
                                <label
                                    htmlFor="startTime"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Start Time
                                </label>
                                <input
                                    id="startTime"
                                    type="time"
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="endTime">
                        {(field) => (
                            <div>
                                <label
                                    htmlFor="endTime"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    End Time
                                </label>
                                <input
                                    id="endTime"
                                    type="time"
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}
                    </form.Field>

                    <form.Field name="isHardLocked">
                        {(field) => (
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={field.state.value}
                                        onChange={(e) =>
                                            field.handleChange(e.target.checked)
                                        }
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        Hard Locked
                                    </span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    If you lock this event, this event will not
                                    be changed when rescheduled! (Hard locked
                                    yk)
                                </p>
                            </div>
                        )}
                    </form.Field>

                    <form.Subscribe
                        selector={(state) => [
                            state.canSubmit,
                            state.isSubmitting,
                        ]}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <button
                                type="submit"
                                disabled={!canSubmit || isSubmitting}
                                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                            >
                                {isSubmitting ? "Creating..." : "Create Event"}
                            </button>
                        )}
                    </form.Subscribe>
                </form>
            </div>
        </div>
    );
}
