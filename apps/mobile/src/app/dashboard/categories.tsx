import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useAreas, useCreateArea } from "../../hooks/useAreas";
import { useCreateSubarea } from "../../hooks/useSubareas";

import ColorPicker, {
    Panel1,
    Swatches,
    Preview,
    OpacitySlider,
    HueSlider,
} from "reanimated-color-picker";
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

export default function Categories() {
    const [section, setSection] = useState<Section>("areas");
    const [message, setMessage] = useState<string | null>(null);

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

    const clearMessage = () => {
        if (message) {
            setMessage(null);
        }
    };

    const handleCreateArea = async () => {
        clearMessage();

        const name = areaName.trim();
        const weight = parseWeight(areaWeight);
        const color = parseColor(areaColor);

        if (!name) {
            setMessage("Area name is required.");
            return;
        }

        if (!color) {
            setMessage("Color must be a valid hex value like #00cdfd.");
            return;
        }

        try {
            await createArea({ name, weight, color });
            setAreaName("");
            setAreaWeight("1");
            setAreaColor(DEFAULT_AREA_COLOR);
            setMessage("Area created.");
        } catch {
            setMessage("Could not create area. Try again.");
        }
    };

    const handleCreateSubarea = async () => {
        clearMessage();

        const name = subareaName.trim();
        const weight = parseWeight(subareaWeight);

        if (!selectedAreaId) {
            setMessage("Pick an area first.");
            return;
        }

        if (!name) {
            setMessage("Subarea name is required.");
            return;
        }

        try {
            await createSubarea({
                area_id: selectedAreaId,
                name,
                weight,
            });
            setSubareaName("");
            setSubareaWeight("1");
            setMessage("Subarea created.");
        } catch {
            setMessage("Could not create subarea. Try again.");
        }
    };

    const isSubmitting = isAreaPending || isSubareaPending;

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="px-5 py-8 flex flex-col gap-10"
        >
            <View className="flex flex-col gap-2">
                <Text className="text-3xl font-bold">Create Categories</Text>
                <Text className="text-muted-foreground">
                    Add your top-level areas and nest subareas inside them.
                </Text>
            </View>

            <View className="rounded-3xl border border-border bg-card p-2">
                <View className="flex-row items-center gap-2">
                    <Pressable
                        className={`flex-1 rounded-2xl px-4 py-3 ${
                            section === "areas" ? "bg-primary" : "bg-background"
                        }`}
                        onPress={() => {
                            setSection("areas");
                            clearMessage();
                        }}
                    >
                        <Text
                            className={`text-center font-semibold ${
                                section === "areas"
                                    ? "text-white"
                                    : "text-foreground"
                            }`}
                        >
                            Areas
                        </Text>
                    </Pressable>

                    <Pressable
                        className={`flex-1 rounded-2xl px-4 py-3 ${
                            section === "subareas"
                                ? "bg-primary"
                                : "bg-background"
                        }`}
                        onPress={() => {
                            setSection("subareas");
                            clearMessage();
                        }}
                    >
                        <Text
                            className={`text-center font-semibold ${
                                section === "subareas"
                                    ? "text-white"
                                    : "text-foreground"
                            }`}
                        >
                            Subareas
                        </Text>
                    </Pressable>
                </View>
            </View>

            {section === "areas" ? (
                <View className="rounded-3xl border border-border bg-card p-5 flex flex-col gap-4">
                    <Text className="text-lg font-bold">Create area</Text>

                    <View className="flex flex-col gap-2">
                        <Text className="text-sm font-semibold text-muted-foreground">
                            Name
                        </Text>
                        <TextInput
                            value={areaName}
                            onChangeText={setAreaName}
                            placeholder="e.g. School"
                            className="rounded-xl border border-border bg-white px-4 py-3"
                            editable={!isSubmitting}
                        />
                    </View>

                    <View className="flex flex-col gap-2">
                        <Text className="text-sm font-semibold text-muted-foreground">
                            Weight (1-5)
                        </Text>
                        <TextInput
                            value={areaWeight}
                            onChangeText={setAreaWeight}
                            keyboardType="number-pad"
                            className="rounded-xl border border-border bg-white px-4 py-3"
                            editable={!isSubmitting}
                        />
                    </View>

                    <View className="flex flex-col gap-2">
                        <Text className="text-sm font-semibold text-muted-foreground">
                            Color
                        </Text>
                        <View className="flex-row items-center gap-3">
                            <View
                                className="h-10 w-10 rounded-xl border border-border"
                                style={{
                                    backgroundColor:
                                        parseColor(areaColor) ??
                                        DEFAULT_AREA_COLOR,
                                }}
                            />
                            <ColorPicker
                                style={{ width: "70%" }}
                                value={areaColor}
                                onComplete={({ hex }) => {
                                    setAreaColor(hex);
                                }}
                            >
                                <Panel1 />
                                <Preview />
                                <HueSlider />
                            </ColorPicker>
                        </View>
                    </View>

                    <Pressable
                        onPress={handleCreateArea}
                        disabled={isSubmitting}
                        className="rounded-xl bg-primary px-4 py-3"
                    >
                        <Text className="text-center text-white font-semibold">
                            {isAreaPending ? "Creating..." : "Create Area"}
                        </Text>
                    </Pressable>
                </View>
            ) : (
                <View className="rounded-3xl border border-border bg-card p-5 flex flex-col gap-4">
                    <Text className="text-lg font-bold">Create subarea</Text>

                    {isAreasLoading ? (
                        <Text className="text-muted-foreground">
                            Loading areas...
                        </Text>
                    ) : areas.length === 0 ? (
                        <Text className="text-muted-foreground">
                            Create at least one area before creating subareas.
                        </Text>
                    ) : (
                        <View className="flex flex-col gap-2">
                            <Text className="text-sm font-semibold text-muted-foreground">
                                Pick an area
                            </Text>
                            <View className="flex-row flex-wrap gap-2">
                                {areas.map((area) => (
                                    <Pressable
                                        key={area.id}
                                        onPress={() =>
                                            setSelectedAreaId(area.id)
                                        }
                                        className={`rounded-full px-4 py-2 border ${
                                            selectedAreaId === area.id
                                                ? "bg-primary border-primary"
                                                : "bg-white border-border"
                                        }`}
                                    >
                                        <Text
                                            className={`font-medium ${
                                                selectedAreaId === area.id
                                                    ? "text-white"
                                                    : "text-foreground"
                                            }`}
                                        >
                                            {area.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    )}

                    <View className="flex flex-col gap-2">
                        <Text className="text-sm font-semibold text-muted-foreground">
                            Name
                        </Text>
                        <TextInput
                            value={subareaName}
                            onChangeText={setSubareaName}
                            placeholder="e.g. History"
                            className="rounded-xl border border-border bg-white px-4 py-3"
                            editable={!isSubmitting}
                        />
                    </View>

                    <View className="flex flex-col gap-2">
                        <Text className="text-sm font-semibold text-muted-foreground">
                            Weight (1-5)
                        </Text>
                        <TextInput
                            value={subareaWeight}
                            onChangeText={setSubareaWeight}
                            keyboardType="number-pad"
                            className="rounded-xl border border-border bg-white px-4 py-3"
                            editable={!isSubmitting}
                        />
                    </View>

                    <View className="flex flex-col gap-2">
                        <Text className="text-sm font-semibold text-muted-foreground">
                            Color
                        </Text>
                        <View className="flex-row items-center gap-3">
                            <View
                                className="h-10 w-10 rounded-xl border border-border"
                                style={{
                                    backgroundColor:
                                        parseColor(areaColor) ??
                                        DEFAULT_AREA_COLOR,
                                }}
                            />
                            <ColorPicker
                                style={{ width: "70%" }}
                                value={areaColor}
                                onComplete={({ hex }) => {
                                    setAreaColor(hex);
                                }}
                            >
                                <Panel1 />
                                <Preview />
                                <HueSlider />
                            </ColorPicker>
                        </View>
                    </View>

                    <Pressable
                        onPress={handleCreateSubarea}
                        disabled={isSubmitting || areas.length === 0}
                        className="rounded-xl bg-primary px-4 py-3"
                    >
                        <Text className="text-center text-white font-semibold">
                            {isSubareaPending
                                ? "Creating..."
                                : "Create Subarea"}
                        </Text>
                    </Pressable>
                </View>
            )}

            {message ? (
                <View className="rounded-xl border border-border bg-card px-4 py-3">
                    <Text className="text-sm text-muted-foreground">
                        {message}
                    </Text>
                </View>
            ) : null}
        </ScrollView>
    );
}
