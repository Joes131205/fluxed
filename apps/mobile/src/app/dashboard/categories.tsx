import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useAreas, useCreateArea } from "../../hooks/useAreas";
import { useCreateSubarea } from "../../hooks/useSubareas";
import { ColorField } from "../../components/ui/ColorField";
import { TextPrimaryInput } from "../../components/ui/TextPrimaryInput";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";

type Section = "areas" | "subareas";

type AreaRecord = {
    id: string;
    name: string;
    weight: number;
    color?: string;
};

const DEFAULT_AREA_COLOR = "#00ff41";

const parseWeight = (value: string) => {
    const next = Number.parseInt(value, 10);
    if (Number.isNaN(next)) return 1;
    return Math.min(5, Math.max(1, next));
};

const parseColor = (value: string) => {
    const raw = value.trim().replace(/^#+/, "").slice(0, 6);
    const normalized = `#${raw}`;
    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return null;
    return normalized.toLowerCase();
};

export default function Categories() {
    const [section, setSection] = useState<Section>("areas");

    const [areaName, setAreaName] = useState("");
    const [areaWeight, setAreaWeight] = useState("1");
    const [areaColor, setAreaColor] = useState(DEFAULT_AREA_COLOR);

    const [subareaName, setSubareaName] = useState("");
    const [subareaWeight, setSubareaWeight] = useState("1");
    const [selectedAreaId, setSelectedAreaId] = useState("");
    const [subareaColor, setSubareaColor] = useState(DEFAULT_AREA_COLOR);

    const { data: areasData, isLoading: isAreasLoading } = useAreas();
    const { mutateAsync: createArea, isPending: isAreaPending } =
        useCreateArea();
    const { mutateAsync: createSubarea, isPending: isSubareaPending } =
        useCreateSubarea();

    const areas = useMemo(
        () => (areasData?.ok ? areasData.data : []) as AreaRecord[],
        [areasData],
    );

    const handleCreateArea = async () => {
        const name = areaName.trim();
        const weight = parseWeight(areaWeight);
        const color = parseColor(areaColor);

        if (!name) {
            Alert.alert("Error", "Area Name is required.");
            return;
        }

        if (!color) {
            Alert.alert("Error", "Invalid hex color format.");
            return;
        }

        try {
            await createArea({ name, weight, color });
            setAreaName("");
            setAreaWeight("1");
            setAreaColor(DEFAULT_AREA_COLOR);
            Alert.alert("Success", "Area created successfully.");
        } catch {
            Alert.alert("System Error", "Initialization failed.");
        }
    };

    const handleCreateSubarea = async () => {
        const name = subareaName.trim();
        const weight = parseWeight(subareaWeight);
        const color = parseColor(subareaColor);

        if (!selectedAreaId) {
            Alert.alert("Error", "Area is required.");
            return;
        }

        if (!name) {
            Alert.alert("Error", "Subarea Name is required.");
            return;
        }

        try {
            await createSubarea({
                area_id: selectedAreaId,
                name,
                weight,
                color,
            });
            setSubareaName("");
            setSubareaWeight("1");
            setSubareaColor(DEFAULT_AREA_COLOR);
            Alert.alert("Success", "Subarea created successfully.");
        } catch {
            Alert.alert("System Error", "Initialization failed.");
        }
    };

    const isSubmitting = isAreaPending || isSubareaPending;

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="flex flex-col gap-6 py-8 px-4"
        >
            <View className="flex flex-col mb-2">
                <Text className="text-2xl font-bold text-primary tracking-tight mb-1">
                    Category
                </Text>
                <View className="h-0.5 w-24 bg-primary mb-3 shadow-[0_0_8px_rgba(0,255,65,0.6)]" />
                <Text className="text-xs text-muted-foreground font-mono uppercase tracking-widest leading-5">
                    Add your area or subarea of your life
                </Text>
            </View>

            <View className="flex-row items-center border border-muted p-4 bg-card mb-2">
                <Pressable
                    className="flex-1"
                    onPress={() => setSection("areas")}
                >
                    <View
                        className={`border px-3 py-2 ${section === "areas" ? "border-primary bg-primary/10" : "border-muted-foreground/30 bg-background"}`}
                    >
                        <Text
                            className={`font-mono text-xs ${section === "areas" ? "text-primary" : "text-muted-foreground/80"} text-center`}
                        >
                            Area
                        </Text>
                    </View>
                </Pressable>

                <View className="px-3">
                    <Ionicons
                        name="caret-forward"
                        size={16}
                        color={section === "subareas" ? "#00ff41" : "#3a6b3a"}
                    />
                </View>

                <Pressable
                    className="flex-1"
                    onPress={() => setSection("subareas")}
                >
                    <View
                        className={`border px-3 py-2 ${section === "subareas" ? "border-primary bg-primary/10" : "border-muted-foreground/30 bg-background"}`}
                    >
                        <Text
                            className={`font-mono text-xs ${section === "subareas" ? "text-primary" : "text-muted-foreground/80"} text-center`}
                        >
                            Subarea
                        </Text>
                    </View>
                </Pressable>
            </View>

            <View className="border-2 border-primary bg-background relative pt-6 pb-4 px-4">
                {section === "areas" ? (
                    <View className="flex flex-col gap-2">
                        <TextPrimaryInput
                            label="Area Name"
                            value={areaName}
                            onChangeText={setAreaName}
                            placeholder="e.g. CORE_SYSTEM"
                            editable={!isSubmitting}
                        />

                        <TextPrimaryInput
                            label="Weight (1-5)"
                            value={areaWeight}
                            onChangeText={setAreaWeight}
                            keyboardType="number-pad"
                            placeholder="e.g. 5"
                            editable={!isSubmitting}
                        />

                        <View className="mb-6">
                            <Text className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/50">
                                Color Hex
                            </Text>
                            <ColorField
                                label="Color"
                                value={areaColor}
                                onChange={setAreaColor}
                                editable={!isSubmitting}
                            />
                        </View>

                        <View className="border-t border-dashed border-muted-foreground/30 pt-4 mt-2">
                            <PrimaryButton
                                label={
                                    isAreaPending
                                        ? "Creating..."
                                        : "Create Area"
                                }
                                onPress={handleCreateArea}
                                disabled={isSubmitting || isAreaPending}
                            />
                        </View>
                    </View>
                ) : (
                    <View className="flex flex-col gap-2">
                        <View className="mb-6">
                            <Text className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/50">
                                Area
                            </Text>
                            {isAreasLoading ? (
                                <Text className="text-primary font-mono text-xs">
                                    Fetching area...
                                </Text>
                            ) : areas.length === 0 ? (
                                <Text className="text-red-500 font-mono text-xs">
                                    Area Empty!
                                </Text>
                            ) : (
                                <View className="flex-row flex-wrap gap-2 p-2 border border-muted bg-card">
                                    {areas.map((area) => {
                                        const isSelected =
                                            selectedAreaId === area.id;
                                        return (
                                            <Pressable
                                                key={area.id}
                                                onPress={() =>
                                                    setSelectedAreaId(area.id)
                                                }
                                                className={`px-3 py-2 border ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/50 bg-background"}`}
                                            >
                                                <Text
                                                    className={`text-xs font-bold uppercase font-mono ${isSelected ? "text-background" : "text-muted-foreground"}`}
                                                >
                                                    {area.name}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            )}
                        </View>

                        <TextPrimaryInput
                            label="Subarea Name"
                            value={subareaName}
                            onChangeText={setSubareaName}
                            placeholder="e.g. UI_DESIGN"
                            editable={!isSubmitting}
                        />

                        <TextPrimaryInput
                            label="Weight (1-5)"
                            value={subareaWeight}
                            onChangeText={setSubareaWeight}
                            keyboardType="number-pad"
                            placeholder="e.g. 3"
                            editable={!isSubmitting}
                        />

                        <View className="mb-6">
                            <Text className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/50">
                                Color Hex
                            </Text>
                            <ColorField
                                label="Color"
                                value={subareaColor}
                                onChange={setSubareaColor}
                                editable={!isSubmitting}
                            />
                        </View>

                        <View className="border-t border-dashed border-muted-foreground/30 pt-4 mt-2">
                            <PrimaryButton
                                label={
                                    isSubareaPending
                                        ? "Creating..."
                                        : "Create Subarea"
                                }
                                onPress={handleCreateSubarea}
                                disabled={isSubmitting || areas.length === 0}
                            />
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
