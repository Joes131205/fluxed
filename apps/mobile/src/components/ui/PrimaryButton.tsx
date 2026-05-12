import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type PrimaryButtonProps = {
    label: string;
    onPress: () => void | Promise<void>;
    loading?: boolean;
    disabled?: boolean;
};

export const PrimaryButton = ({
    label,
    onPress,
    loading = false,
    disabled = false,
}: PrimaryButtonProps) => {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            className="w-full mt-2"
        >
            {({ pressed }) => (
                <View
                    className={`
                        w-full py-2 border-4 border-foreground
                        bg-primary flex items-center justify-center transition-transform
                        ${pressed ? "scale-95" : "scale-100"}
                        ${disabled || loading ? "opacity-70" : "opacity-100"}
                    `}
                >
                    {loading ? (
                        <ActivityIndicator color="#0f172a" />
                    ) : (
                        <Text className="text-foreground font-black text-base">
                            {label}
                        </Text>
                    )}
                </View>
            )}
        </Pressable>
    );
};
