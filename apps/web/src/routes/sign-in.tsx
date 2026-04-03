import { env } from "@/env";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground sm:px-8">
            <section className="w-full max-w-md">
                <div className="w-full space-y-6 rounded-3xl p-6 backdrop-blur-sm sm:p-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-foreground">
                            Welcome back
                        </h2>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        className="space-y-5"
                    >
                        <form.Field name="email">
                            {(field) => (
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-1.5 block text-sm font-semibold text-foreground"
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
                                        className="w-full rounded-xl border bg-white px-3.5 py-3 text-foreground outline-none transition placeholder:text-foreground/45 focus:border-primary focus:ring-2 focus:ring-primary/30"
                                        placeholder="you@example.com"
                                    />
                                    {!field.state.meta.isValid && (
                                        <p className="mt-1.5 text-xs font-semibold text-red-500">
                                            *{" "}
                                            {
                                                field.state.meta.errors[0]
                                                    ?.message
                                            }
                                        </p>
                                    )}
                                </div>
                            )}
                        </form.Field>

                        <form.Field name="password">
                            {(field) => (
                                <div>
                                    <div className="mb-1.5 flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-semibold text-foreground"
                                        >
                                            Password
                                        </label>
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm font-medium text-accent transition hover:opacity-80"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={field.state.value}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        className="w-full rounded-xl border bg-white px-3.5 py-3 text-foreground outline-none transition placeholder:text-foreground/45 focus:border-primary focus:ring-2 focus:ring-primary/30"
                                        placeholder="••••••••"
                                    />
                                    {!field.state.meta.isValid && (
                                        <p className="mt-1.5 text-xs font-semibold text-red-500">
                                            *{" "}
                                            {
                                                field.state.meta.errors[0]
                                                    ?.message
                                            }
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
                                        className="w-full cursor-pointer rounded-xl bg-primary py-3.5 font-bold text-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-primary/60 disabled:opacity-90"
                                    >
                                        {isSubmitting
                                            ? "Loading..."
                                            : "Sign In"}
                                    </button>
                                );
                            }}
                        </form.Subscribe>
                    </form>

                    <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-foreground/40">
                        <div className="h-px flex-1 bg-foreground/10" />
                        <span>or</span>
                        <div className="h-px flex-1 bg-foreground/10" />
                    </div>

                    <a
                        href={env.VITE_API_URL + "/api/auth/google/start"}
                        className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-foreground/10 bg-white px-5 py-3 font-semibold text-foreground transition hover:bg-neutral-100"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            className="h-5 w-5"
                            aria-hidden="true"
                            focusable="false"
                        >
                            <path
                                fill="#FFC107"
                                d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.227 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.06 0 5.84 1.154 7.955 3.045l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
                            />
                            <path
                                fill="#FF3D00"
                                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.06 0 5.84 1.154 7.955 3.045l5.657-5.657C34.046 6.053 29.27 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                            />
                            <path
                                fill="#1DB954"
                                d="M24 44c5.168 0 9.86-1.977 13.409-5.191l-6.196-5.238C29.142 35.091 26.677 36 24 36c-5.206 0-9.621-3.316-11.283-7.946l-6.522 5.025C9.505 39.556 16.675 44 24 44z"
                            />
                            <path
                                fill="#171717"
                                d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.09 5.571l.003-.002 6.196 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"
                            />
                        </svg>
                        <span>Continue with Google</span>
                    </a>
                </div>
                <p className="mt-5 text-center text-sm text-foreground/75">
                    Don't have an account?{" "}
                    <Link to="/sign-up" className="font-semibold text-accent">
                        Sign Up
                    </Link>
                </p>
            </section>
        </div>
    );
}
