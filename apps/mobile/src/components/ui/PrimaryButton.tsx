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
    loading,
    ...props
}: ButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            className="w-full mt-2"
            {...props}
        >
            {({ pressed }) => {
                const bgColor = disabled
                    ? "bg-transparent"
                    : pressed
                      ? "bg-primary"
                      : "bg-primary/10";

                const borderColor = disabled
                    ? "border-primary/10 border-dashed"
                    : pressed
                      ? "border-primary shadow-[0_0_8px_rgba(0,255,65,0.6)]"
                      : "border-primary/20";

                const textColor = disabled
                    ? "text-muted-foreground"
                    : pressed
                      ? "text-background"
                      : "text-foreground";

                return (
                    <View
                        className={`border py-4 flex items-center justify-center transition-colors ${bgColor} ${borderColor}`}
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
}
