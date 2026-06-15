import { useState } from "react";
import {
    ScrollView,
    View,
    Text,
    Pressable,
    TextInput,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUniwind } from "uniwind";
import { PageHeader } from "../../../components/ui/PageHeader";
import { BackButton } from "../../../components/ui/BackButton";

import { useAllSubareas } from "../../../hooks/useSubareas";
import {
    useAllActions,
    useCreateAction,
    useUpdateAction,
    useDeleteAction,
} from "../../../hooks/useActions";

export default function SubareaActionsScreen() {
    const theme = useUniwind();
    const [selectedSubarea, setSelectedSubarea] = useState<any | null>(null);
    const [newTitle, setNewTitle] = useState("");

    const { data: subareasData, isLoading: isSubareaLoading } =
        useAllSubareas();
    const { data: actionsData, isLoading: isActionsLoading } = useAllActions(
        selectedSubarea?.id || null,
    );

    const { mutate: createAction, isPending: isCreating } = useCreateAction();
    const { mutate: updateAction } = useUpdateAction();
    const { mutate: deleteAction } = useDeleteAction();

    const subareas = subareasData?.ok ? (subareasData.data as any[]) : [];
    const currentActions = actionsData?.ok ? (actionsData.data as any[]) : [];

    const handleAdd = () => {
        if (!newTitle.trim() || !selectedSubarea) return;
        createAction(
            { subarea_id: selectedSubarea.id, title: newTitle.trim() },
            {
                onSuccess: () => setNewTitle(""),
            },
        );
    };
    const getIconColor = (currentTheme: string) => {
        if (currentTheme === "dark") {
            return "#dddddd";
        }
        return "#111111";
    };
    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="flex flex-col gap-6 py-8 px-4"
        >
            <BackButton />

            <PageHeader
                title="Micro-Tasks"
                description="Manage specific actions for your subareas"
                dividerWidthClassName="w-40"
            />

            {!selectedSubarea ? (
                <View className="flex flex-col gap-4">
                    <Text className="text-[10px] font-black uppercase tracking-widest text-primary/50">
                        Select a Subarea to Manage
                    </Text>

                    {isSubareaLoading ? (
                        <ActivityIndicator
                            size="small"
                            className="color-primary my-4"
                        />
                    ) : subareas.length === 0 ? (
                        <View className="border border-muted bg-card p-5 items-center">
                            <Text className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
                                No Subareas Found
                            </Text>
                        </View>
                    ) : (
                        subareas.map((subarea) => (
                            <Pressable
                                key={subarea.id}
                                onPress={() => setSelectedSubarea(subarea)}
                                className="border border-primary/30 bg-card p-4 flex-row items-center justify-between active:bg-primary/5 transition-colors"
                            >
                                <View>
                                    <Text className="text-primary font-bold uppercase tracking-widest">
                                        {subarea.name}
                                    </Text>
                                    <Text className="text-[10px] font-mono text-muted-foreground mt-1 uppercase">
                                        Area: {subarea.areaName ?? "Unknown"}
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    className="color-primary/50"
                                />
                            </Pressable>
                        ))
                    )}
                </View>
            ) : (
                <View className="flex flex-col gap-4">
                    <View className="border border-primary bg-primary/10 p-4 mb-2 flex-row justify-between items-center">
                        <View>
                            <Text className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-1">
                                Editing Target
                            </Text>
                            <Text className="text-primary font-bold uppercase tracking-widest text-lg">
                                {selectedSubarea.name}
                            </Text>
                        </View>
                        <Pressable
                            onPress={() => setSelectedSubarea(null)}
                            className="px-3 py-2 border border-primary/50 bg-background"
                        >
                            <Text className="text-primary font-mono text-[10px] uppercase font-bold tracking-widest">
                                Back
                            </Text>
                        </Pressable>
                    </View>

                    <View className="flex-row items-center gap-2 border border-primary/50 bg-background focus-within:border-primary px-3 py-1 mb-4">
                        <TextInput
                            className="flex-1 text-foreground font-mono text-xs py-3 outline-none"
                            value={newTitle}
                            onChangeText={setNewTitle}
                            placeholder="Add new action item..."
                            placeholderTextColor="#737373"
                            onSubmitEditing={handleAdd}
                            returnKeyType="done"
                        />
                        <Pressable
                            onPress={handleAdd}
                            disabled={isCreating || !newTitle.trim()}
                            className={`px-4 py-2 border border-primary/50 transition-colors ${
                                newTitle.trim()
                                    ? "bg-primary/10 active:bg-primary/20"
                                    : "opacity-50"
                            }`}
                        >
                            {isCreating ? (
                                <ActivityIndicator
                                    size="small"
                                    className="color-primary"
                                />
                            ) : (
                                <Text className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest">
                                    Add
                                </Text>
                            )}
                        </Pressable>
                    </View>

                    <Text className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-1 mt-2">
                        Current Items
                    </Text>

                    <View className="flex flex-col gap-2">
                        {isActionsLoading ? (
                            <ActivityIndicator
                                size="small"
                                className="color-primary my-4"
                            />
                        ) : currentActions.length === 0 ? (
                            <View className="border border-dashed border-muted p-6 items-center">
                                <Text className="text-muted-foreground font-mono text-xs italic">
                                    No actions added yet.
                                </Text>
                            </View>
                        ) : (
                            currentActions.map((task: any) => (
                                <View
                                    key={task.id}
                                    className="flex-row items-center justify-between border border-muted bg-card p-3"
                                >
                                    <Pressable
                                        onPress={() =>
                                            updateAction({
                                                id: task.id,
                                                isCompleted: !task.isCompleted,
                                            })
                                        }
                                        className="flex-row items-center flex-1 gap-3"
                                    >
                                        <View
                                            className={`w-5 h-5 border flex items-center justify-center ${
                                                task.isCompleted
                                                    ? "border-primary bg-primary"
                                                    : "border-primary/50 bg-transparent"
                                            }`}
                                        >
                                            {task.isCompleted && (
                                                <Ionicons
                                                    name="checkmark-sharp"
                                                    size={14}
                                                    color={getIconColor(
                                                        theme.theme,
                                                    )}
                                                />
                                            )}
                                        </View>
                                        <Text
                                            className={`font-mono text-sm flex-1 ${
                                                task.isCompleted
                                                    ? "text-muted-foreground line-through"
                                                    : "text-foreground"
                                            }`}
                                        >
                                            {task.title}
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={() => deleteAction(task.id)}
                                        className="p-2 ml-2 active:bg-destructive/10"
                                    >
                                        <Ionicons
                                            name="trash-outline"
                                            size={18}
                                            className="color-destructive"
                                        />
                                    </Pressable>
                                </View>
                            ))
                        )}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}
