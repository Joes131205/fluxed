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
            pressedBg: "bg-foreground/5",
            text: "text-foreground/50",
            pressedText: "text-foreground",
            indicatorClass: "text-foreground",
        },
        danger: {
            bg: "bg-transparent",
            pressedBg: "bg-destructive/10",
            text: "text-destructive/70",
            pressedText: "text-destructive",
            indicatorClass: "text-destructive",
        },
        success: {
            bg: "bg-transparent",
            pressedBg: "bg-primary/10",
            text: "text-primary/70",
            pressedText: "text-primary",
            indicatorClass: "text-primary",
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
                    ? "text-foreground/20"
                    : pressed
                      ? style.pressedText
                      : style.text;

                return (
                    <View
                        className={`w-full py-3 flex items-center justify-center transition-colors ${currentBg}`}
                    >
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                className={style.indicatorClass}
                            />
                        ) : (
                            <Text
                                className={`uppercase tracking-widest text-xs font-bold font-mono ${currentText}`}
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
