import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/sign-in")({
    component: RouteComponent,
});

function RouteComponent() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onChange: z.object({
                email: z.email().nonempty("Required"),
                password: z
                    .string()
                    .min(8, "Min 8 chars required")
                    .nonempty("Required"),
            }),
        },
        onSubmit: async ({ value }) => {
            await login(value.email, value.password);
            navigate({ to: "/dashboard" });
        },
    });
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <h1 className="text-3xl font-bold text-center">Sign In</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <form.Field name="email">
                        {(field) => (
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
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
                    <form.Field name="password">
                        {(field) => (
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
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
                    <form.Subscribe
                        selector={(state) => [
                            state.canSubmit,
                            state.isSubmitting,
                        ]}
                    >
                        {([canSubmit, isSubmitting]) => {
                            return (
                                <button
                                    type="submit"
                                    disabled={!canSubmit || isSubmitting}
                                    className="w-full cursor-pointer bg-blue-600 py-3.5 font-bold text-white rounded-full transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-90"
                                >
                                    {isSubmitting ? "Loading..." : "Sign In"}
                                </button>
                            );
                        }}
                    </form.Subscribe>
                </form>
            </div>
        </div>
    );
}
