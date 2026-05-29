import React, { useState } from "react";
import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import {
    useAreas,
    useUpdateArea,
    useDeleteArea,
} from "../../../hooks/useAreas";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextPrimaryInput } from "../../../components/ui/TextPrimaryInput";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { ColorField } from "../../../components/ui/ColorField";

export default function AreaSetting() {
    const router = useRouter();
    const { data: areasData, isLoading: isAreaLoading } = useAreas();
    const { mutateAsync: updateArea } = useUpdateArea();
    const { mutateAsync: deleteArea } = useDeleteArea();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [weight, setWeight] = useState("1");
    const [color, setColor] = useState("#00ff41");

    if (isAreaLoading) {
        return (
            <View className="flex flex-1 items-center justify-center bg-background">
                <Text className="text-primary font-mono uppercase tracking-widest">
                    Fetching...
                </Text>
            </View>
        );
    }

    const areas = areasData?.ok ? (areasData.data as any[]) : [];

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="flex flex-col gap-6 py-8 px-4"
        >
            <View className="flex flex-col mb-2">
                <Text className="text-2xl font-bold text-primary tracking-tight mb-1">
                    Area Settings
                </Text>
                <View className="h-[2px] w-32 bg-primary mb-3 shadow-[0_0_8px_rgba(0,255,65,0.6)]" />
                <Text className="text-xs text-muted-foreground font-mono uppercase tracking-widest leading-5">
                    Modify existing areas
                </Text>
            </View>

            {areas.length === 0 ? (
                <View className="border border-dashed border-muted p-6 items-center bg-card mt-4">
                    <Ionicons
                        name="warning-outline"
                        size={32}
                        color="#3a6b3a"
                    />
                    <Text className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-4">
                        Area Empty
                    </Text>
                    <Text className="text-xs font-mono text-primary/50 mt-2 text-center">
                        Initialize an area in the creation menu first.
                    </Text>
                </View>
            ) : (
                <View className="flex flex-col gap-4">
                    {areas.map((area: any) => (
                        <View
                            key={area.id}
                            className="border border-muted bg-card"
                        >
                            {editingId === area.id ? (
                                <View className="p-4 border-2 border-primary bg-background relative">
                                    <View className="mt-2 flex flex-col gap-2">
                                        <TextPrimaryInput
                                            label="Area Name"
                                            value={name}
                                            onChangeText={setName}
                                            placeholder="Area name"
                                        />
                                        <TextPrimaryInput
                                            label="Weight (1-5)"
                                            value={weight}
                                            onChangeText={setWeight}
                                            keyboardType="number-pad"
                                            placeholder="Weight"
                                        />

                                        <View className="mb-4">
                                            <Text className="mb-2 text-[10px] font-black uppercase tracking-widest text-primary/50">
                                                Color Hex
                                            </Text>
                                            <ColorField
                                                label="Color"
                                                value={color}
                                                onChange={setColor}
                                                editable={true}
                                            />
                                        </View>

                                        <View className="flex-row gap-3 mt-4 pt-4 border-t border-dashed border-primary/30">
                                            <View className="flex-1">
                                                <Pressable
                                                    onPress={() =>
                                                        setEditingId(null)
                                                    }
                                                    className="w-full py-4 border border-muted bg-background items-center"
                                                >
                                                    <Text className="text-muted-foreground font-mono text-xs font-bold uppercase tracking-widest">
                                                        ABORT
                                                    </Text>
                                                </Pressable>
                                            </View>
                                            <View className="flex-1">
                                                <PrimaryButton
                                                    label="OVERWRITE"
                                                    onPress={async () => {
                                                        const parsedWeight =
                                                            parseInt(weight) ||
                                                            1;
                                                        if (!name.trim()) {
                                                            Alert.alert(
                                                                "Error",
                                                                "Area Name is required.",
                                                            );
                                                            return;
                                                        }
                                                        try {
                                                            await updateArea({
                                                                id: area.id,
                                                                area: {
                                                                    name: name.trim(),
                                                                    weight: parsedWeight,
                                                                    color,
                                                                },
                                                            });
                                                            setEditingId(null);
                                                        } catch (err) {
                                                            Alert.alert(
                                                                "System Error",
                                                                err instanceof
                                                                    Error
                                                                    ? err.message
                                                                    : "Failed to update",
                                                            );
                                                        }
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                /* READ MODE */
                                <View className="p-4 flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1 gap-4">
                                        <View
                                            className="w-10 h-10 border-2 border-white/20"
                                            style={{
                                                backgroundColor:
                                                    area.color || "#3a6b3a",
                                            }}
                                        />
                                        <View className="flex-1 pr-2">
                                            <Text
                                                className="text-primary font-bold uppercase tracking-widest"
                                                numberOfLines={1}
                                            >
                                                {area.name}
                                            </Text>
                                            <Text className="text-[10px] font-mono text-muted-foreground mt-1 uppercase">
                                                Weight: {area.weight ?? 1}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row gap-2 border-l border-muted pl-4">
                                        <Pressable
                                            onPress={() => {
                                                setEditingId(area.id);
                                                setName(area.name ?? "");
                                                setWeight(
                                                    String(area.weight ?? 1),
                                                );
                                                setColor(
                                                    area.color ?? "#00ff41",
                                                );
                                            }}
                                            className="px-3 py-2 border border-primary/50 bg-primary/10"
                                        >
                                            <Text className="text-primary font-mono text-xs uppercase">
                                                Edit
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={() => {
                                                Alert.alert(
                                                    "Warning",
                                                    "Are you sure you want to delete this area? This will also wipe its linked subareas.",
                                                    [
                                                        {
                                                            text: "Cancel",
                                                            style: "cancel",
                                                        },
                                                        {
                                                            text: "Yuh",
                                                            style: "destructive",
                                                            onPress:
                                                                async () => {
                                                                    try {
                                                                        await deleteArea(
                                                                            area.id,
                                                                        );
                                                                    } catch (err) {
                                                                        Alert.alert(
                                                                            "System Error",
                                                                            err instanceof
                                                                                Error
                                                                                ? err.message
                                                                                : "Failed to delete",
                                                                        );
                                                                    }
                                                                },
                                                        },
                                                    ],
                                                );
                                            }}
                                            className="px-3 py-2 border border-red-500/50 bg-red-500/10"
                                        >
                                            <Text className="text-red-400 font-mono text-xs uppercase">
                                                Delete
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}
