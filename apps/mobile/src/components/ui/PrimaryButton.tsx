import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type ButtonProps = {
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
}: ButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            className="w-full mt-2"
            {...props}
        >
            {({ pressed }) => {
                // Saat ditekan, tombol menyala hijau neon ala CRT
                const bgColor = disabled
                    ? "bg-transparent"
                    : pressed
                      ? "bg-primary"
                      : "bg-white/10";

                const borderColor = disabled
                    ? "border-white/10 border-dashed"
                    : pressed
                      ? "border-primary shadow-[0_0_8px_rgba(0,255,65,0.6)]"
                      : "border-white/20";

                const textColor = disabled
                    ? "text-white/30"
                    : pressed
                      ? "text-black"
                      : "text-white";

                return (
                    <View
                        className={`border py-4 flex items-center justify-center transition-colors ${bgColor} ${borderColor}`}
                    >
                        <Text
                            className={`uppercase tracking-widest text-sm font-bold font-mono ${textColor}`}
                        >
                            {label}
                        </Text>
                    </View>
                );
            }}
        </Pressable>
    );
}

export const SecondaryButton = ({
    label,
    onPress,
    loading = false,
    disabled = false,
}: ButtonProps) => {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            className="w-full mt-2"
        >
            {({ pressed }) => {
                const bgColor = disabled
                    ? "bg-transparent"
                    : pressed
                      ? "bg-white/10"
                      : "bg-transparent";
                const borderColor = disabled
                    ? "border-white/10 border-dashed"
                    : "border-white/70";
                const textColor = disabled
                    ? "text-white/30"
                    : pressed
                      ? "text-white"
                      : "text-white/70";

                return (
                    <View
                        className={`w-full py-4 border flex items-center justify-center transition-colors ${bgColor} ${borderColor}`}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text
                                className={`uppercase tracking-widest text-sm font-bold font-mono ${textColor}`}
                            >
                                {label}
                            </Text>
                        )}
                    </View>
                );
            }}
        </Pressable>
    );
};
