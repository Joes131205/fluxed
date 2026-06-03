import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { CategorySection } from "./categories.types";

type SectionToggleProps = {
    section: CategorySection;
    onChange: (section: CategorySection) => void;
};

export function SectionToggle({ section, onChange }: SectionToggleProps) {
    return (
        <View className="flex-row items-center border border-muted p-4 bg-card mb-2">
            <Pressable className="flex-1" onPress={() => onChange("areas")}>
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

            <Pressable className="flex-1" onPress={() => onChange("subareas")}>
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
    );
}
