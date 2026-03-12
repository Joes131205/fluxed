import { useCreateSubarea } from "@/hooks/useSubareas";
import { useAreas } from "@/hooks/useAreas";
import { requireAuth } from "@/utils/requireAuth";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/dashboard/subareas/create")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
    const { data: areasData } = useAreas();
    const { mutate } = useCreateSubarea();

    const form = useForm({
        defaultValues: {
            name: "",
            weight: 1,
            area_id: "",
        },
        validators: {
            onChange: z.object({
                name: z.string().nonempty("Required"),
                weight: z.number().min(1).max(5),
                area_id: z.string().nonempty("Select an area"),
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
                    Create Subarea
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    e.g., "History" under "School"
                </p>

                <form
                    onSubmit={(e) => {
                        form.handleSubmit();
                        e.preventDefault();
                    }}
                    className="space-y-4"
                >
                    <form.Field name="area_id">
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
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select an area</option>
                                    {areasData?.data?.map((area: any) => (
                                        <option key={area.id} value={area.id}>
                                            {area.name}
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
                                    placeholder="e.g., History"
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

                    <form.Field name="weight">
                        {(field) => (
                            <div>
                                <label
                                    htmlFor="weight"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Weight (1-5)
                                </label>
                                <input
                                    id="weight"
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(
                                            parseInt(e.target.value),
                                        )
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
                                {isSubmitting
                                    ? "Creating..."
                                    : "Create Subarea"}
                            </button>
                        )}
                    </form.Subscribe>
                </form>
            </div>
        </div>
    );
}
