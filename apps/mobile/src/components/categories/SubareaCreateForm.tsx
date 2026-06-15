import { useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useAreas } from "../../hooks/useAreas";
import { useCreateSubarea } from "../../hooks/useSubareas";
import { ColorField } from "../ui/ColorField";
import { TextPrimaryInput } from "../ui/TextPrimaryInput";
import { PrimaryButton } from "../ui/PrimaryButton";
import { CategoryFormCard } from "./CategoryFormCard";
import { DEFAULT_CATEGORY_COLOR, parseWeight } from "./categories.utils";
import type { AreaRecord } from "./categories.types";

export function SubareaCreateForm() {
    const [subareaName, setSubareaName] = useState("");
    const [subareaWeight, setSubareaWeight] = useState("1");
    const [subareaDescription, setSubareaDescription] = useState("");
    const [selectedAreaId, setSelectedAreaId] = useState("");
    const [subareaColor, setSubareaColor] = useState(DEFAULT_CATEGORY_COLOR);

    const { data: areasData, isLoading: isAreasLoading } = useAreas();
    const { mutateAsync: createSubarea, isPending: isSubareaPending } =
        useCreateSubarea();

    const areas = useMemo(
        () => (areasData?.ok ? areasData.data : []) as AreaRecord[],
        [areasData],
    );

    const handleCreateSubarea = async () => {
        const name = subareaName.trim();
        const weight = parseWeight(subareaWeight);

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
                color: subareaColor,
                description: subareaDescription,
            });
            setSubareaName("");
            setSubareaWeight("1");
            setSubareaColor(DEFAULT_CATEGORY_COLOR);
            setSubareaDescription("");
            Alert.alert("Success", "Subarea created successfully.");
        } catch {
            Alert.alert("System Error", "Initialization failed.");
        }
    };

    return (
        <CategoryFormCard>
            <View className="flex flex-col gap-2">
                <View className="mb-6">
                    <Text className="mb-2 text-[10px] font-black uppercase tracking-widest text-foreground/50">
                        Area
                    </Text>
                    {isAreasLoading ? (
                        <Text className="text-primary font-mono text-xs">
                            Fetching area...
                        </Text>
                    ) : areas.length === 0 ? (
                        <Text className="text-destructive font-mono text-xs">
                            Area Empty!
                        </Text>
                    ) : (
                        <View className="flex-row flex-wrap gap-2 p-2 border border-muted bg-card">
                            {areas.map((area) => {
                                const isSelected = selectedAreaId === area.id;

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
                    placeholder="e.g. Homework"
                    editable={!isSubareaPending}
                />
                <TextPrimaryInput
                    label="Description"
                    value={subareaDescription}
                    onChangeText={setSubareaDescription}
                    placeholder="e.g. Solo Project"
                    editable={!isSubareaPending}
                />
                <TextPrimaryInput
                    label="Weight (1-5)"
                    value={subareaWeight}
                    onChangeText={setSubareaWeight}
                    keyboardType="number-pad"
                    placeholder="e.g. 3"
                    editable={!isSubareaPending}
                />

                <View className="mb-6">
                    <Text className="mb-2 text-[10px] font-black uppercase tracking-widest text-foreground/50">
                        Color Hex
                    </Text>
                    <ColorField
                        label="Color"
                        value={subareaColor}
                        onChange={setSubareaColor}
                        editable={!isSubareaPending}
                    />
                </View>

                <View className="border-t border-dashed border-muted-foreground/30 pt-4 mt-2">
                    <PrimaryButton
                        label={
                            isSubareaPending ? "Creating..." : "Create Subarea"
                        }
                        onPress={handleCreateSubarea}
                        disabled={isSubareaPending || areas.length === 0}
                    />
                </View>
            </View>
        </CategoryFormCard>
    );
}
