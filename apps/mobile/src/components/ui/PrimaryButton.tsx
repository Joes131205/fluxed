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
                        w-full py-5 border-2 flex items-center justify-center 
                        ${pressed ? "bg-white border-white" : "bg-black border-white"}
                    `}
                >
                    <Text
                        className={`uppercase tracking-widest text-sm ${
                            pressed ? "text-black" : "text-white"
                        }`}
                        style={{ fontFamily: "PressStart2P_400Regular" }}
                    >
                        {label}
                    </Text>
                </View>
            )}
        </Pressable>
    );
};
