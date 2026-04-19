import { Text, TextInput, View } from "react-native";

import ColorPicker, {
    HueSlider,
    Panel1,
    Preview,
    Swatches,
} from "reanimated-color-picker";

const DEFAULT_COLOR = "#00cdfd";

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

                <ColorPicker
                    style={{ width: "100%" }}
                    value={resolvedColor}
                    onComplete={({ hex }) => {
                        onChange(hex);
                    }}
                >
                    <Panel1 style={{ borderRadius: 12, minHeight: 120 }} />
                    <Preview style={{ marginTop: 8, borderRadius: 12 }} />
                    <HueSlider style={{ marginTop: 8, borderRadius: 9999 }} />
                    <Swatches style={{ marginTop: 8 }} />
                </ColorPicker>
            </View>

            <Text className="text-xs text-muted-foreground">
                Pick a color or type a 6-digit hex value.
            </Text>
        </View>
    );
}
