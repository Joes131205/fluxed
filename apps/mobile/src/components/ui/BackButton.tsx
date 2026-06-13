import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export const BackButton = () => {
    const router = useRouter();

    return (
        <View className="items-start mb-4">
            <Pressable
                onPress={() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace("/dashboard");
                    }
                }}
                className="flex-row items-center gap-2 px-3 py-2 border border-primary bg-background active:bg-primary/20 transition-colors"
            >
                <Text className="text-primary font-mono font-bold text-lg leading-none">
                    {"<"}
                </Text>
                <Text className="text-primary font-mono text-xs tracking-widest uppercase mt-0.5">
                    Go Back
                </Text>
            </Pressable>
        </View>
    );
};
