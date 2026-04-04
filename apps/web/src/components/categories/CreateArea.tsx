import { useCreateArea } from "@/hooks/useAreas";
import { useForm } from "@tanstack/react-form";
import z from "zod";

export const CreateArea = () => {
    const { mutateAsync, isPending } = useCreateArea();
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
            await mutateAsync(value);
            form.reset();
        },
    });

    const fieldClassName =
        "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-muted/40";

    return (
        <div className="mx-auto max-w-xl rounded-3xl border border-border/60 bg-white p-6 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.25)] md:p-8">
            <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    Area
                </p>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                    Create area
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                    Add a top-level category that can later hold subareas.
                </p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="space-y-5"
            >
                <form.Field name="name">
                    {(field) => (
                        <div className="space-y-1.5">
                            <label
                                htmlFor="name"
                                className="text-sm font-semibold text-foreground"
                            >
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="e.g. School"
                                value={field.state.value}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                className={fieldClassName}
                                disabled={isPending}
                            />
                            {field.state.meta.isTouched &&
                                !field.state.meta.isValid && (
                                    <p className="text-xs font-medium text-red-500">
                                        {field.state.meta.errors[0]?.message}
                                    </p>
                                )}
                        </div>
                    )}
                </form.Field>
                <form.Field name="weight">
                    {(field) => (
                        <div className="space-y-1.5">
                            <label
                                htmlFor="weight"
                                className="text-sm font-semibold text-foreground"
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
                                    field.handleChange(
                                        Number.parseInt(
                                            e.target.value || "1",
                                            10,
                                        ),
                                    )
                                }
                                className={fieldClassName}
                                disabled={isPending}
                            />
                            <p className="text-xs text-muted-foreground">
                                Use a value from 1 to 5.
                            </p>
                            {field.state.meta.isTouched &&
                                !field.state.meta.isValid && (
                                    <p className="text-xs font-medium text-red-500">
                                        {field.state.meta.errors[0]?.message}
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
                                disabled={
                                    !canSubmit || isSubmitting || isPending
                                }
                                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting || isPending
                                    ? "Creating..."
                                    : "Create Area"}
                            </button>
                        );
                    }}
                </form.Subscribe>
            </form>
        </div>
    );
};
