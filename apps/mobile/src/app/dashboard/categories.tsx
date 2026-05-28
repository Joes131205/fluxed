import React, { useMemo, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { useAreas, useCreateArea } from "../../hooks/useAreas";
import { useCreateSubarea } from "../../hooks/useSubareas";
import { ColorField } from "../../components/ui/ColorField";
type Section = "areas" | "subareas";

type AreaRecord = {
    id: string;
    name: string;
    weight: number;
    color?: string;
};

const DEFAULT_AREA_COLOR = "#00cdfd";

const parseWeight = (value: string) => {
    const next = Number.parseInt(value, 10);

    if (Number.isNaN(next)) {
        return 1;
    }

    return Math.min(5, Math.max(1, next));
};

const parseColor = (value: string) => {
    const raw = value.trim().replace(/^#+/, "").slice(0, 6);
    const normalized = `#${raw}`;

    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) {
        return null;
    }

    return normalized.toLowerCase();
};

const getTextColorBasedOnRGB = (r: number, g: number, b: number) => {
    // based on W3C
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#ffffff";
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

    const areas = useMemo(() => (areasData || []) as AreaRecord[], [areasData]);

    const handleCreateArea = async () => {
        const name = areaName.trim();
        const weight = parseWeight(areaWeight);
        const color = parseColor(areaColor);

        if (!name) {
            Alert.alert("Error", "Area name is required.");
            return;
        }

        if (!color) {
            Alert.alert(
                "Error",
                "Color must be a valid hex value like #00cdfd.",
            );
            return;
        }

        try {
            await createArea({ name, weight, color });
            setAreaName("");
            setAreaWeight("1");
            setAreaColor(DEFAULT_AREA_COLOR);
            Alert.alert("Success", "Area created.");
        } catch {
            Alert.alert("Error", "Could not create area. Try again.");
        }
    };

    const handleCreateSubarea = async () => {
        const name = subareaName.trim();
        const weight = parseWeight(subareaWeight);
        const color = parseColor(subareaColor);

        if (!selectedAreaId) {
            Alert.alert("Error", "Pick an area first.");
            return;
        }

        if (!name) {
            Alert.alert("Error", "Subarea name is required.");
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
            Alert.alert("Success", "Subarea created.");
        } catch {
            Alert.alert("Error", "Could not create subarea. Try again.");
        }
    };

    const isSubmitting = isAreaPending || isSubareaPending;

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName=" flex flex-col gap-5 py-10 px-4"
        >
            <View className="flex flex-col pb-6 mb-6 border-b-2 border-dashed border-white/30">
                <Text
                    className="text-2xl text-white uppercase"
                    style={{ fontFamily: "PressStart2P_400Regular" }}
                >
                    Category
                </Text>

                <Text className="mt-3 text-xs text-white/70 font-mono uppercase tracking-widest leading-5">
                    Create your area / subarea of life here.
                </Text>
            </View>

            <View className="mb-6 flex-row border-2 border-white/30">
                <Pressable
                    className={`flex-1 py-4 flex-row justify-center items-center ${
                        section === "areas" ? "bg-white" : "bg-black"
                    }`}
                    onPress={() => {
                        setSection("areas");
                    }}
                >
                    <Text
                        className={`font-black uppercase tracking-widest text-xs ${
                            section === "areas" ? "text-black" : "text-white/50"
                        }`}
                    >
                        Areas
                    </Text>
                </Pressable>

                <Pressable
                    className={`flex-1 py-4 flex-row justify-center items-center ${
                        section === "subareas" ? "bg-white" : "bg-black"
                    }`}
                    onPress={() => {
                        setSection("subareas");
                    }}
                >
                    <Text
                        className={`font-black uppercase tracking-widest text-xs ${
                            section === "subareas"
                                ? "text-black"
                                : "text-white/50"
                        }`}
                    >
                        Subareas
                    </Text>
                </Pressable>
            </View>

            {section === "areas" ? (
                <View className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 flex flex-col gap-6 mt-4">
                    <View className="border-b border-dashed border-white/20 pb-4">
                        <Text className="text-xl font-bold text-white tracking-tight">
                            Create Area
                        </Text>
                    </View>

                    <View className="flex flex-col gap-5">
                        <View className="flex flex-col gap-2">
                            <Text className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">
                                Name
                            </Text>
                            <TextInput
                                value={areaName}
                                onChangeText={setAreaName}
                                placeholder="e.g. School"
                                placeholderTextColor="rgba(255, 255, 255, 0.2)"
                                className="rounded-xl border border-white/20 bg-black text-white px-4 py-4 text-base"
                                editable={!isSubmitting}
                                selectionColor="#ffffff"
                            />
                        </View>

                        <View className="flex flex-col gap-2">
                            <Text className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">
                                Weight (1-5)
                            </Text>
                            <TextInput
                                value={areaWeight}
                                onChangeText={setAreaWeight}
                                keyboardType="number-pad"
                                placeholder="e.g. 3"
                                placeholderTextColor="rgba(255, 255, 255, 0.2)"
                                className="rounded-xl border border-white/20 bg-black text-white px-4 py-4 text-base"
                                editable={!isSubmitting}
                                selectionColor="#ffffff"
                            />
                        </View>

                        <View className="flex flex-col gap-2">
                            <Text className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">
                                Color
                            </Text>

                            <ColorField
                                label="Color"
                                value={areaColor}
                                onChange={setAreaColor}
                                editable={!isSubmitting}
                            />
                        </View>

                        <Pressable
                            onPress={handleCreateArea}
                            disabled={isSubmitting || isAreaPending}
                            className="w-full mt-2"
                        >
                            {({ pressed }) => (
                                <View
                                    className={`rounded-xl border border-white/20 py-4 flex items-center justify-center transition-colors ${
                                        pressed ? "bg-white" : "bg-black"
                                    }`}
                                >
                                    <Text
                                        className={`text-sm font-bold uppercase tracking-widest ${
                                            pressed
                                                ? "text-black"
                                                : "text-white"
                                        }`}
                                    >
                                        {isAreaPending
                                            ? "Creating..."
                                            : "Create Area"}
                                    </Text>
                                </View>
                            )}
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 flex flex-col gap-6 mt-4">
                    <View className="border-b border-dashed border-white/20 pb-4">
                        <Text className="text-xl font-bold text-white tracking-tight">
                            Create Subarea
                        </Text>
                    </View>

                    {isAreasLoading ? (
                        <Text className="text-sm font-semibold text-white/50 px-1">
                            Loading areas...
                        </Text>
                    ) : areas.length === 0 ? (
                        <Text className="text-sm font-semibold text-white/50 px-1">
                            Create at least one area before creating subareas.
                        </Text>
                    ) : (
                        <View className="flex flex-col gap-3">
                            <Text className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">
                                Parent Area
                            </Text>
                            <View className="flex-row flex-wrap gap-2">
                                {areas.map((area) => {
                                    const isSelected =
                                        selectedAreaId === area.id;
                                    const areaColor =
                                        area.color ?? DEFAULT_AREA_COLOR;

                                    return (
                                        <Pressable
                                            key={area.id}
                                            onPress={() =>
                                                setSelectedAreaId(area.id)
                                            }
                                            className={`px-4 py-3 border`}
                                            style={{
                                                borderColor: isSelected
                                                    ? areaColor
                                                    : "white",
                                            }}
                                        >
                                            <Text
                                                className={`text-xs font-bold uppercase tracking-widest text-white`}
                                            >
                                                {area.name}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    <View className="flex flex-col gap-2">
                        <Text className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">
                            Subarea Name
                        </Text>
                        <TextInput
                            value={subareaName}
                            onChangeText={setSubareaName}
                            placeholder="e.g. History"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                            className="rounded-xl border border-white/20 bg-black text-white px-4 py-4 text-base"
                            editable={!isSubmitting}
                            selectionColor="#ffffff"
                        />
                    </View>

                    <View className="flex flex-col gap-2">
                        <Text className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">
                            Weight (1-5)
                        </Text>
                        <TextInput
                            value={subareaWeight}
                            onChangeText={setSubareaWeight}
                            keyboardType="number-pad"
                            placeholder="e.g. 3"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                            className="rounded-xl border border-white/20 bg-black text-white px-4 py-4 text-base"
                            editable={!isSubmitting}
                            selectionColor="#ffffff"
                        />
                    </View>

                    <View className="flex flex-col gap-2">
                        <ColorField
                            label="Color"
                            value={subareaColor}
                            onChange={setSubareaColor}
                            editable={!isSubmitting}
                        />
                    </View>

                    <Pressable
                        onPress={handleCreateSubarea}
                        disabled={isSubmitting || areas.length === 0}
                        className="w-full mt-2"
                    >
                        {({ pressed }) => {
                            const isDisabled =
                                isSubmitting || areas.length === 0;
                            return (
                                <View
                                    className={`rounded-xl border py-4 flex items-center justify-center transition-colors ${
                                        isDisabled
                                            ? "bg-black border-white/10"
                                            : pressed
                                              ? "bg-white border-white"
                                              : "bg-black border-white/20"
                                    }`}
                                >
                                    <Text
                                        className={`text-sm font-bold uppercase tracking-widest ${
                                            isDisabled
                                                ? "text-white/30"
                                                : pressed
                                                  ? "text-black"
                                                  : "text-white"
                                        }`}
                                    >
                                        {isSubareaPending
                                            ? "Creating..."
                                            : "Create Subarea"}
                                    </Text>
                                </View>
                            );
                        }}
                    </Pressable>
                </View>
            )}
        </ScrollView>
    );
}
