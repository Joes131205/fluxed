import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type GoogleAuthButtonProps = {
    onPress: () => void | Promise<void>;
    loading?: boolean;
    disabled?: boolean;
};

export const GoogleAuthButton = ({
    onPress,
    loading = false,
    disabled = false,
}: GoogleAuthButtonProps) => {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            className="w-full"
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
                                className={`uppercase tracking-widest text-xs font-bold font-mono ${textColor}`}
                            >
                                CONTINUE WITH GOOGLE
                            </Text>
                        )}
                    </View>
                );
            }}
        </Pressable>
    );
};
