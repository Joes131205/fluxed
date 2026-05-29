import React, { useState } from "react";
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
    const [isFocused, setIsFocused] = useState(false);
    const resolvedColor = parseColor(value) ?? DEFAULT_COLOR;
    const displayValue = value.replace(/^#+/, "");

    return (
        <View className="flex flex-col gap-3">
            <View className="flex-row items-center gap-3">
                <View
                    className="h-14 w-14 border-2 border-white/20"
                    style={{ backgroundColor: resolvedColor }}
                />

                <View
                    className={`flex-1 flex-row items-center border-2 px-4 py-4 transition-colors ${
                        isFocused
                            ? "border-primary bg-primary/5 shadow-[0_0_8px_rgba(0,255,65,0.2)]"
                            : "border-white/30 bg-black"
                    }`}
                >
                    <Text
                        className={`font-mono text-base mr-1 ${isFocused ? "text-primary" : "text-white/40"}`}
                    >
                        #
                    </Text>
                    <TextInput
                        value={displayValue}
                        onChangeText={(text) => onChange(`#${text}`)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="00CDFD"
                        placeholderTextColor="rgba(255, 255, 255, 0.2)"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={editable}
                        maxLength={6}
                        selectionColor="#00ff41"
                        className="flex-1 text-white font-mono text-base outline-none"
                    />
                </View>
            </View>

            <View className="flex-row flex-wrap gap-3 mt-1">
                {SWATCHES.map((swatch) => {
                    const isSelected = resolvedColor === swatch;

                    return (
                        <Pressable
                            key={swatch}
                            className={`h-10 w-10 border-2 transition-colors ${
                                isSelected
                                    ? "border-primary shadow-[0_0_8px_rgba(0,255,65,0.6)]"
                                    : "border-white/10"
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

            <View className="mt-2">
                <Text className="text-[10px] text-white/50 font-bold uppercase tracking-widest ml-1">
                    Select a swatch or enter 6-digit hex
                </Text>
                <Text className="text-[10px] text-red-400/80 font-bold uppercase tracking-widest mt-1 ml-1">
                    I would suggest not choosing a color that blends in the
                    background
                </Text>
            </View>
        </View>
    );
}
