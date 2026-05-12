import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";

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
            className="w-full mt-2"
        >
            {({ pressed }) => (
                <View
                    className={`
                        w-full flex-row items-center justify-center gap-3 border-4 border-foreground
                        bg-white px-5 py-3 transition-transform
                        ${pressed ? "scale-95" : "scale-100"}
                        ${disabled || loading ? "opacity-70" : "opacity-100"}
                    `}
                >
                    {loading ? (
                        <ActivityIndicator color="#0f172a" />
                    ) : (
                        <>
                            <FontAwesome6
                                iconStyle="brand"
                                name="google"
                                size={20}
                                color="#4285F4"
                            />
                            <Text className="text-base font-black text-foreground">
                                Continue with Google
                            </Text>
                        </>
                    )}
                </View>
            )}
        </Pressable>
    );
};
