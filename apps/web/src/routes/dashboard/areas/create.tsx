import { useCreateArea } from "@/hooks/useAreas";
import { requireAuth } from "@/utils/requireAuth";
import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/dashboard/areas/create")({
    beforeLoad: requireAuth,
    component: RouteComponent,
});

function RouteComponent() {
    const { mutate } = useCreateArea();
    const form = useForm({
        defaultValues: {
            name: "",
            weight: 1,
        },
        validators: {
            onChange: z.object({
                name: z.string().nonempty("Required"),
                weight: z.number().min(1).max(5),
            }),
        },
        onSubmit: async ({ value }) => {
            try {
                mutate(value);
            } catch (error) {
                console.log(error);
            }
        },
    });
    return (
        <div>
            <h2>Create Area</h2>
            <p>Yes</p>
            <form
                onSubmit={(e) => {
                    form.handleSubmit();
                    e.preventDefault();
                }}
            >
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
                                Weight
                            </label>
                            <input
                                id="weight"
                                type="number"
                                min={1}
                                max={5}
                                value={field.state.value}
                                onChange={(e) =>
                                    field.handleChange(parseInt(e.target.value))
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
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    {([canSubmit, isSubmitting]) => {
                        return (
                            <button
                                type="submit"
                                disabled={!canSubmit || isSubmitting}
                                className="w-full cursor-pointer bg-blue-600 py-3.5 font-bold text-white rounded-full transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-90"
                            >
                                {isSubmitting ? "Loading..." : "Create Area"}
                            </button>
                        );
                    }}
                </form.Subscribe>
            </form>
        </div>
    );
}
