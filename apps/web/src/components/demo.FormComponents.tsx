import { useStore } from "@tanstack/react-form";

// Demo form components - simplified (hooks disabled due to missing context)

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import * as ShadcnSelect from "@/components/ui/select";
import { Slider as ShadcnSlider } from "@/components/ui/slider";
import { Switch as ShadcnSwitch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SubscribeButton({ label }: { label: string }) {
    return <Button type="submit">{label}</Button>;
}

function ErrorMessages({
    errors,
}: {
    errors: Array<string | { message: string }>;
}) {
    return (
        <>
            {errors.map((error) => (
                <div
                    key={typeof error === "string" ? error : error.message}
                    className="text-red-500 mt-1 font-bold"
                >
                    {typeof error === "string" ? error : error.message}
                </div>
            ))}
        </>
    );
}

export function TextField({
    label,
    placeholder,
}: {
    label: string;
    placeholder?: string;
}) {
    return (
        <div>
            <Label htmlFor={label} className="mb-2 text-xl font-bold">
                {label}
            </Label>
            <Input placeholder={placeholder} />
        </div>
    );
}

export function TextArea({
    label,
    rows = 3,
}: {
    label: string;
    rows?: number;
}) {
    return (
        <div>
            <Label htmlFor={label} className="mb-2 text-xl font-bold">
                {label}
            </Label>
            <ShadcnTextarea id={label} rows={rows} />
        </div>
    );
}

export function Select({
    label,
    values,
    placeholder,
}: {
    label: string;
    values: Array<{ label: string; value: string }>;
    placeholder?: string;
}) {
    return (
        <div>
            <ShadcnSelect.Select>
                <ShadcnSelect.SelectTrigger className="w-full">
                    <ShadcnSelect.SelectValue placeholder={placeholder} />
                </ShadcnSelect.SelectTrigger>
                <ShadcnSelect.SelectContent>
                    <ShadcnSelect.SelectGroup>
                        <ShadcnSelect.SelectLabel>
                            {label}
                        </ShadcnSelect.SelectLabel>
                        {values.map((value) => (
                            <ShadcnSelect.SelectItem
                                key={value.value}
                                value={value.value}
                            >
                                {value.label}
                            </ShadcnSelect.SelectItem>
                        ))}
                    </ShadcnSelect.SelectGroup>
                </ShadcnSelect.SelectContent>
            </ShadcnSelect.Select>
        </div>
    );
}

export function Slider({ label }: { label: string }) {
    return (
        <div>
            <Label htmlFor={label} className="mb-2 text-xl font-bold">
                {label}
            </Label>
            <ShadcnSlider id={label} value={[0]} />
        </div>
    );
}

export function Switch({ label }: { label: string }) {
    return (
        <div>
            <div className="flex items-center gap-2">
                <ShadcnSwitch id={label} />
                <Label htmlFor={label}>{label}</Label>
            </div>
        </div>
    );
}
