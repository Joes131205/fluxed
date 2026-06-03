import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import {
    useAreas,
    useUpdateArea,
    useDeleteArea,
} from "../../../hooks/useAreas";
import { CategoryEntityList } from "../../../components/settings/CategoryEntityList";
import { PageHeader } from "../../../components/ui/PageHeader";

export default function AreaSetting() {
    const { data: areasData, isLoading: isAreaLoading } = useAreas();
    const { mutateAsync: updateArea } = useUpdateArea();
    const { mutateAsync: deleteArea } = useDeleteArea();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [weight, setWeight] = useState("1");
    const [color, setColor] = useState("#00ff41");

    const areas = areasData?.ok ? (areasData.data as any[]) : [];

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="flex flex-col gap-6 py-8 px-4"
        >
            <PageHeader
                title="Area Settings"
                description="Modify existing areas"
                dividerWidthClassName="w-32"
            />

            <CategoryEntityList
                loading={isAreaLoading}
                emptyTitle="Area Empty"
                emptyDescription="Initialize an area in the creation menu first."
                items={areas}
                editingId={editingId}
                name={name}
                weight={weight}
                color={color}
                onStartEdit={(area) => {
                    setEditingId(area.id);
                    setName(area.name ?? "");
                    setWeight(String(area.weight ?? 1));
                    setColor(area.color ?? "#00ff41");
                }}
                onCancelEdit={() => setEditingId(null)}
                onNameChange={setName}
                onWeightChange={setWeight}
                onColorChange={setColor}
                onOverwrite={async () => {
                    const parsedWeight = parseInt(weight) || 1;

                    if (!name.trim()) {
                        Alert.alert("Error", "Area Name is required.");
                        return;
                    }

                    try {
                        await updateArea({
                            id: editingId as string,
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
                            err instanceof Error
                                ? err.message
                                : "Failed to update",
                        );
                    }
                }}
                onDelete={(area) => {
                    Alert.alert(
                        "Warning",
                        "Are you sure you want to delete this area? This will also wipe its linked subareas.",
                        [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Yuh",
                                style: "destructive",
                                onPress: async () => {
                                    try {
                                        await deleteArea(area.id);
                                    } catch (err) {
                                        Alert.alert(
                                            "System Error",
                                            err instanceof Error
                                                ? err.message
                                                : "Failed to delete",
                                        );
                                    }
                                },
                            },
                        ],
                    );
                }}
                renderItemDetails={(area) => [`Weight: ${area.weight ?? 1}`]}
                editLabel="OVERWRITE"
                cancelLabel="ABORT"
                itemLabel="Area Name"
            />
        </ScrollView>
    );
}
