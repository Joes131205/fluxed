import { View, Text } from "react-native";
import { SecondaryButton } from "../ui/SecondaryButton";
import { TertiaryButton } from "../ui/TertiaryButton";

type SettingsActionsCardProps = {
    onEditAreas: () => void;
    onEditSubareas: () => void;
    onLogout: () => void;
};

export function SettingsActionsCard({
    onEditAreas,
    onEditSubareas,
    onLogout,
}: SettingsActionsCardProps) {
    return (
        <View className="border border-muted bg-card p-5 mt-2">
            <Text className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-4">
                Others
            </Text>

            <View className="flex-row gap-3 mb-2">
                <View className="flex-1">
                    <SecondaryButton label="Edit Areas" onPress={onEditAreas} />
                </View>

                <View className="flex-1">
                    <SecondaryButton
                        label="Edit Subareas"
                        onPress={onEditSubareas}
                    />
                </View>
            </View>

            <View className="mt-4 border-t border-muted/50 pt-4">
                <TertiaryButton
                    label="LogOut"
                    onPress={onLogout}
                    variant="danger"
                />
            </View>
        </View>
    );
}
