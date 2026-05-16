import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type SecondaryButtonProps = {
    label: string;
    onPress: () => void | Promise<void>;
    loading?: boolean;
    disabled?: boolean;
};

export const SecondaryButton = ({
    label,
    onPress,
    loading = false,
    disabled = false,
}: SecondaryButtonProps) => {
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
                    ? "border-white/10"
                    : pressed
                      ? "border-white/50"
                      : "border-white/30";
                const textColor = disabled
                    ? "text-white/30"
                    : pressed
                      ? "text-white"
                      : "text-white/80";

                return (
                    <View
                        className={`w-full py-4 rounded-xl border flex items-center justify-center transition-colors ${bgColor} ${borderColor}`}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text
                                className={`uppercase tracking-widest text-sm font-bold ${textColor}`}
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
