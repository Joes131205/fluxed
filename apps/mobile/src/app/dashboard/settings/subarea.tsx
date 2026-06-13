import { useState } from "react";
import { Alert, ScrollView } from "react-native";
import {
    useAllSubareas,
    useUpdateSubarea,
    useDeleteSubarea,
} from "../../../hooks/useSubareas";
import { CategoryEntityList } from "../../../components/settings/CategoryEntityList";
import { PageHeader } from "../../../components/ui/PageHeader";
import { BackButton } from "../../../components/ui/BackButton";

export default function SubareaSetting() {
    const { data: subareasData, isLoading: isAreaLoading } = useAllSubareas();
    const { mutateAsync: updateSubarea } = useUpdateSubarea();
    const { mutateAsync: deleteSubarea } = useDeleteSubarea();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [weight, setWeight] = useState("1");
    const [color, setColor] = useState("#008c23");
    const [description, setDescription] = useState("");

    const subareas = subareasData?.ok ? (subareasData.data as any[]) : [];

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="flex flex-col gap-6 py-8 px-4"
        >
            <BackButton />

            <PageHeader
                title="Subarea Settings"
                description="Modify existing subareas"
                dividerWidthClassName="w-40"
            />

            <CategoryEntityList
                loading={isAreaLoading}
                emptyTitle="Subarea Empty"
                emptyDescription="Initialize a subarea in the creation menu first."
                items={subareas}
                editingId={editingId}
                name={name}
                weight={weight}
                color={color}
                description={description}
                onStartEdit={(subarea) => {
                    setEditingId(subarea.id);
                    setName(subarea.name ?? "");
                    setWeight(String(subarea.weight ?? 1));
                    setColor(subarea.color ?? "#008c23");
                }}
                onCancelEdit={() => setEditingId(null)}
                onNameChange={setName}
                onWeightChange={setWeight}
                onColorChange={setColor}
                onDescriptionChange={setDescription}
                onOverwrite={async () => {
                    const parsedWeight = parseInt(weight) || 1;

                    if (!name.trim()) {
                        Alert.alert("Error", "Subarea Name is required.");
                        return;
                    }

                    try {
                        await updateSubarea({
                            id: editingId as string,
                            subarea: {
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
                onDelete={(subarea) => {
                    Alert.alert(
                        "Warning",
                        "Are you sure you want to delete this subarea?",
                        [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Yuh",
                                style: "destructive",
                                onPress: async () => {
                                    try {
                                        await deleteSubarea(subarea.id);
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
                renderItemDetails={(subarea) => [
                    `Area: ${subarea.areaName ?? subarea.area_id.substring(0, 6)}`,
                    `Weight: ${subarea.weight ?? 1}`,
                ]}
                editLabel="Overwrite"
                cancelLabel="Cancel"
                itemLabel="Subarea Name"
            />
        </ScrollView>
    );
}
