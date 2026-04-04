import { useAreas } from "@/hooks/useAreas";
import { useCreateSubarea } from "@/hooks/useSubareas";
import { useForm } from "@tanstack/react-form";
import z from "zod";

export const CreateSubarea = () => {
    const { data: areasData } = useAreas();
    const { mutateAsync, isPending } = useCreateSubarea();

    const areas = areasData?.ok ? areasData.data : [];

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
        onSubmit: async ({ value }) => {
            await mutateAsync(value);
            form.reset();
        },
    });

    const fieldClassName =
        "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-muted/40";

    return (
        <div className="mx-auto max-w-xl rounded-3xl border border-border/60 bg-linear-to-br from-white to-slate-50 p-6 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.25)] md:p-8">
            <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    Subarea
                </p>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                    Create subarea
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                    Add a nested item under an existing area.
                </p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="space-y-5"
            >
                <form.Field name="area_id">
                    {(field) => (
                        <div className="space-y-1.5">
                            <label
                                htmlFor="area_id"
                                className="text-sm font-semibold text-foreground"
                            >
                                Area
                            </label>
                            <select
                                id="area_id"
                                value={field.state.value}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                className={fieldClassName}
                                disabled={isPending || areas.length === 0}
                            >
                                <option value="">
                                    {areas.length > 0
                                        ? "Select an area"
                                        : "Create an area first"}
                                </option>
                                {areas.map((area: any) => (
                                    <option key={area.id} value={area.id}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                            {areas.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    You need at least one area before creating a
                                    subarea.
                                </p>
                            ) : null}
                            {field.state.meta.isTouched &&
                                !field.state.meta.isValid && (
                                    <p className="text-xs font-medium text-red-500">
                                        {field.state.meta.errors[0]?.message}
                                    </p>
                                )}
                        </div>
                    )}
                </form.Field>

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
                                placeholder='e.g. "History"'
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
                    {([canSubmit, isSubmitting]) => (
                        <button
                            type="submit"
                            disabled={
                                !canSubmit ||
                                isSubmitting ||
                                isPending ||
                                areas.length === 0
                            }
                            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting || isPending
                                ? "Creating..."
                                : "Create Subarea"}
                        </button>
                    )}
                </form.Subscribe>
            </form>
        </div>
    );
};
