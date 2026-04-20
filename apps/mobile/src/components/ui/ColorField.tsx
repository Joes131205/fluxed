import { Pressable, Text, TextInput, View } from "react-native";

const DEFAULT_COLOR = "#00cdfd";
const SWATCHES = [
    "#00cdfd",
    "#06b6d4",
    "#22c55e",
    "#84cc16",
    "#eab308",
    "#f97316",
    "#ef4444",
    "#ec4899",
    "#a855f7",
    "#6366f1",
    "#0f172a",
    "#6b7280",
] as const;

const parseColor = (value: string) => {
    const raw = value.trim().replace(/^#+/, "").slice(0, 6);
    const normalized = `#${raw}`;

    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) {
        return null;
    }

    return normalized.toLowerCase();
};

type ColorFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    editable: boolean;
};

export function ColorField({
    label,
    value,
    onChange,
    editable,
}: ColorFieldProps) {
    const resolvedColor = parseColor(value) ?? DEFAULT_COLOR;

    return (
        <View className="flex flex-col gap-2">
            <Text className="text-sm font-semibold text-muted-foreground">
                {label}
            </Text>

            <View className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-3">
                <View className="flex-row items-center gap-3">
                    <View
                        className="h-10 w-10 rounded-xl border border-border"
                        style={{ backgroundColor: resolvedColor }}
                    />

                    <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="#00cdfd"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={editable}
                        className="flex-1 rounded-xl border border-border bg-white px-4 py-3"
                    />
                </View>

                <View className="flex-row flex-wrap gap-2">
                    {SWATCHES.map((swatch) => {
                        const isSelected = resolvedColor === swatch;

                        return (
                            <Pressable
                                key={swatch}
                                className="h-9 w-9 rounded-lg border"
                                disabled={!editable}
                                style={{
                                    backgroundColor: swatch,
                                    borderColor: isSelected
                                        ? "#111827"
                                        : "#d1d5db",
                                    borderWidth: isSelected ? 2 : 1,
                                }}
                                onPress={() => onChange(swatch)}
                            />
                        );
                    })}
                </View>
            </View>

            <Text className="text-xs text-muted-foreground">
                Pick a color or type a 6-digit hex value.
            </Text>
        </View>
    );
}
