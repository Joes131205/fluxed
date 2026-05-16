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
    label?: string;
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

    const displayValue = value.replace(/^#+/, "");

    return (
        <View className="flex flex-col gap-3">
            <View className="flex-row items-center gap-3">
                <View
                    className="h-14 w-14 rounded-xl border-2 border-white/10"
                    style={{ backgroundColor: resolvedColor }}
                />

                <View className="flex-1 flex-row items-center rounded-xl border border-white/20 bg-black px-4 py-4">
                    <Text className="text-white/40 font-mono text-base mr-1">
                        #
                    </Text>
                    <TextInput
                        value={displayValue}
                        onChangeText={(text) => onChange(`#${text}`)}
                        placeholder="00CDFD"
                        placeholderTextColor="rgba(255, 255, 255, 0.2)"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={editable}
                        maxLength={6}
                        selectionColor="#ffffff"
                        className="flex-1 text-white font-mono text-base"
                    />
                </View>
            </View>

            <View className="flex-row flex-wrap gap-3 mt-1">
                {SWATCHES.map((swatch) => {
                    const isSelected = resolvedColor === swatch;

                    return (
                        <Pressable
                            key={swatch}
                            className={`h-10 w-10 rounded-lg border-2 ${
                                isSelected
                                    ? "border-white"
                                    : "border-transparent"
                            }`}
                            disabled={!editable}
                            style={{
                                backgroundColor: swatch,
                                opacity: editable ? 1 : 0.5,
                            }}
                            onPress={() => onChange(swatch)}
                        />
                    );
                })}
            </View>

            <Text className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1 ml-1">
                Select a swatch or enter 6-digit hex
            </Text>
        </View>
    );
}
