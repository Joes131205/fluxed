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
