import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type TertiaryButtonProps = {
    label: string;
    onPress: () => void | Promise<void>;
    loading?: boolean;
    disabled?: boolean;
    variant?: "default" | "danger" | "success";
};

export const TertiaryButton = ({
    label,
    onPress,
    loading = false,
    disabled = false,
    variant = "default",
}: TertiaryButtonProps) => {
    const variantStyles = {
        default: {
            bg: "bg-transparent",
            pressedBg: "bg-white/5",
            text: "text-white/50",
            pressedText: "text-white",
            indicator: "#ffffff",
        },
        danger: {
            bg: "bg-transparent",
            pressedBg: "bg-red-500/10",
            text: "text-red-500/70",
            pressedText: "text-red-400",
            indicator: "#ef4444",
        },
        success: {
            bg: "bg-transparent",
            pressedBg: "bg-green-500/10",
            text: "text-green-500/70",
            pressedText: "text-green-400",
            indicator: "#22c55e",
        },
    };

    const style = variantStyles[variant];

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            className="w-full mt-2"
        >
            {({ pressed }) => {
                const currentBg = disabled
                    ? "bg-transparent"
                    : pressed
                      ? style.pressedBg
                      : style.bg;
                const currentText = disabled
                    ? "text-white/20"
                    : pressed
                      ? style.pressedText
                      : style.text;

                return (
                    <View
                        className={`w-full py-3 rounded-xl flex items-center justify-center transition-colors ${currentBg}`}
                    >
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                color={style.indicator}
                            />
                        ) : (
                            <Text
                                className={`uppercase tracking-widest text-xs font-bold ${currentText}`}
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
