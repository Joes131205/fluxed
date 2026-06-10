import { Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    CategoryEntityCard,
    CategoryEntityEditCard,
    CategoryEntityEmptyState,
    CategoryEntityRow,
} from "./CategoryEntityCard";
import { PrimaryButton } from "../ui/PrimaryButton";
import { ColorField } from "../ui/ColorField";
import { TextPrimaryInput } from "../ui/TextPrimaryInput";

type BaseCategoryItem = {
    id: string;
    name: string;
    weight?: number;
    color?: string;
};

type CategoryEntityListProps<T extends BaseCategoryItem> = {
    title?: string;
    dividerWidthClassName?: string;
    loading: boolean;
    emptyTitle: string;
    emptyDescription: string;
    items: T[];
    editingId: string | null;
    name: string;
    weight: string;
    color: string;
    description: string;
    onStartEdit: (item: T) => void;
    onCancelEdit: () => void;
    onNameChange: (value: string) => void;
    onWeightChange: (value: string) => void;
    onColorChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onOverwrite: () => void;
    onDelete: (item: T) => void;
    renderItemDetails: (item: T) => string[];
    editLabel: string;
    cancelLabel: string;
    itemLabel: string;
};

export function CategoryEntityList<T extends BaseCategoryItem>({
    loading,
    emptyTitle,
    emptyDescription,
    items,
    editingId,
    name,
    weight,
    color,
    description,
    onStartEdit,
    onCancelEdit,
    onNameChange,
    onWeightChange,
    onColorChange,
    onDescriptionChange,
    onOverwrite,
    onDelete,
    renderItemDetails,
    editLabel,
    cancelLabel,
    itemLabel,
}: CategoryEntityListProps<T>) {
    if (loading) {
        return (
            <View className="flex flex-1 items-center justify-center bg-background">
                <Text className="text-primary font-mono uppercase tracking-widest">
                    Fetching...
                </Text>
            </View>
        );
    }

    if (items.length === 0) {
        return (
            <CategoryEntityEmptyState
                icon={
                    <Ionicons
                        name="warning-outline"
                        size={32}
                        color="#3a6b3a"
                    />
                }
                title={emptyTitle}
                description={emptyDescription}
            />
        );
    }

    return (
        <View className="flex flex-col gap-4">
            {items.map((item) => (
                <CategoryEntityCard key={item.id}>
                    {editingId === item.id ? (
                        <CategoryEntityEditCard>
                            <TextPrimaryInput
                                label={itemLabel}
                                value={name}
                                onChangeText={onNameChange}
                                placeholder={itemLabel}
                            />
                            <TextPrimaryInput
                                label="Description"
                                value={description}
                                onChangeText={onDescriptionChange}
                                placeholder="Description"
                            />

                            <TextPrimaryInput
                                label="Weight (1-5)"
                                value={weight}
                                onChangeText={onWeightChange}
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
                                    onChange={onColorChange}
                                    editable={true}
                                />
                            </View>

                            <View className="flex-row gap-3 mt-4 pt-4 border-t border-dashed border-primary/30">
                                <View className="flex-1">
                                    <Pressable
                                        onPress={onCancelEdit}
                                        className="w-full py-4 border border-muted bg-background items-center"
                                    >
                                        <Text className="text-muted-foreground font-mono text-xs font-bold uppercase tracking-widest">
                                            {cancelLabel}
                                        </Text>
                                    </Pressable>
                                </View>
                                <View className="flex-1">
                                    <PrimaryButton
                                        label={editLabel}
                                        onPress={onOverwrite}
                                    />
                                </View>
                            </View>
                        </CategoryEntityEditCard>
                    ) : (
                        <CategoryEntityRow>
                            <View className="flex-row items-center flex-1 gap-4">
                                <View
                                    className="w-10 h-10 border-2 border-primary/20"
                                    style={{
                                        backgroundColor:
                                            item.color || "#3a6b3a",
                                    }}
                                />
                                <View className="flex-1 pr-2">
                                    <Text
                                        className="text-primary font-bold uppercase tracking-widest"
                                        numberOfLines={1}
                                    >
                                        {item.name}
                                    </Text>
                                    {renderItemDetails(item).map((line) => (
                                        <Text
                                            key={line}
                                            className="text-[10px] font-mono text-muted-foreground mt-1 uppercase"
                                        >
                                            {line}
                                        </Text>
                                    ))}
                                </View>
                            </View>

                            <View className="flex-row gap-2 border-l border-muted pl-4">
                                <Pressable
                                    onPress={() => onStartEdit(item)}
                                    className="px-3 py-2 border border-primary/50 bg-primary/10"
                                >
                                    <Text className="text-primary font-mono text-xs uppercase">
                                        Edit
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => onDelete(item)}
                                    className="px-3 py-2 border border-destructive/50 bg-destructive/10"
                                >
                                    <Text className="text-destructive font-mono text-xs uppercase">
                                        Delete
                                    </Text>
                                </Pressable>
                            </View>
                        </CategoryEntityRow>
                    )}
                </CategoryEntityCard>
            ))}
        </View>
    );
}
