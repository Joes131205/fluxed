import { Alert, Text, View } from "react-native";
import { useState } from "react";
import { useCreateArea } from "../../hooks/useAreas";
import { ColorField } from "../ui/ColorField";
import { TextPrimaryInput } from "../ui/TextPrimaryInput";
import { PrimaryButton } from "../ui/PrimaryButton";
import { CategoryFormCard } from "./CategoryFormCard";
import {
    DEFAULT_CATEGORY_COLOR,
    parseColor,
    parseWeight,
} from "./categories.utils";

export function AreaCreateForm() {
    const [areaName, setAreaName] = useState("");
    const [areaWeight, setAreaWeight] = useState("1");
    const [areaColor, setAreaColor] = useState(DEFAULT_CATEGORY_COLOR);

    const { mutateAsync: createArea, isPending: isAreaPending } =
        useCreateArea();

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
            setAreaColor(DEFAULT_CATEGORY_COLOR);
            Alert.alert("Success", "Area created successfully.");
        } catch {
            Alert.alert("System Error", "Initialization failed.");
        }
    };

    return (
        <CategoryFormCard>
            <View className="flex flex-col gap-2">
                <TextPrimaryInput
                    label="Area Name"
                    value={areaName}
                    onChangeText={setAreaName}
                    placeholder="e.g. Academic"
                    editable={!isAreaPending}
                />

                <TextPrimaryInput
                    label="Weight (1-5)"
                    value={areaWeight}
                    onChangeText={setAreaWeight}
                    keyboardType="number-pad"
                    placeholder="e.g. 5"
                    editable={!isAreaPending}
                />

                <View className="mb-6">
                    <Text className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/50">
                        Color Hex
                    </Text>
                    <ColorField
                        label="Color"
                        value={areaColor}
                        onChange={setAreaColor}
                        editable={!isAreaPending}
                    />
                </View>

                <View className="border-t border-dashed border-muted-foreground/30 pt-4 mt-2">
                    <PrimaryButton
                        label={isAreaPending ? "Creating..." : "Create Area"}
                        onPress={handleCreateArea}
                        disabled={isAreaPending}
                    />
                </View>
            </View>
        </CategoryFormCard>
    );
}
