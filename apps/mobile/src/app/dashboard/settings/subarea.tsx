import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSubareas } from "../../../hooks/useSubareas";

export default function SubareaSetting() {
    const { data: subareasData, isLoading: isAreaLoading } = useSubareas();

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="px-5 py-8 flex flex-col gap-10"
        >
            <View className="flex flex-col gap-2">
                <Text className="text-3xl font-bold">Subarea Setting</Text>
                <Text className="text-muted-foreground">
                    Edit your subarea here!
                </Text>
            </View>
        </ScrollView>
    );
}
