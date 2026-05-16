import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type PrimaryButtonProps = {
    label: string;
    onPress: () => void | Promise<void>;
    loading?: boolean;
    disabled?: boolean;
};

export function PrimaryButton({
    label,
    onPress,
    disabled,
    ...props
}: PrimaryButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            className="w-full mt-2"
            {...props}
        >
            {({ pressed }) => {
                // 1. The Surface Elevation Fix
                const bgColor = disabled
                    ? "bg-transparent" // Fades into background when unusable
                    : pressed
                      ? "bg-white" // Flashes bright when tapped
                      : "bg-[#1A1A1A]"; // <-- The new, visible resting state

                const borderColor = disabled
                    ? "border-white/10"
                    : pressed
                      ? "border-white"
                      : "border-white/20";

                const textColor = disabled
                    ? "text-white/30"
                    : pressed
                      ? "text-black"
                      : "text-white";

                return (
                    <View
                        className={`rounded-xl border py-4 flex items-center justify-center transition-colors ${bgColor} ${borderColor}`}
                    >
                        <Text
                            className={`uppercase tracking-widest text-sm font-bold ${textColor}`}
                        >
                            {label}
                        </Text>
                    </View>
                );
            }}
        </Pressable>
    );
}
