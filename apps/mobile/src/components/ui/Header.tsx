import React from "react";
import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export const Header = () => {
    const router = useRouter();

    return (
        <View className="flex-row items-center justify-between px-4 py-3 bg-background border-b border-muted">
            <View className="flex-row items-center gap-3">
                <View
                    className="w-10 h-10 rounded flex items-center justify-center"
                    style={{ backgroundColor: "#00ff41" }}
                >
                    <Text className="font-bold text-black text-sm">F</Text>
                </View>

                <View>
                    <Text className="text-primary font-bold text-base">
                        FLUXED
                    </Text>
                    <Text className="text-[10px] text-muted-foreground uppercase font-mono">
                        Planner
                    </Text>
                </View>
            </View>

            <Pressable
                onPress={() => router.push("/dashboard/settings")}
                className="p-2"
            >
                <Ionicons name="settings-outline" size={22} color="#3a6b3a" />
            </Pressable>
        </View>
    );
};
