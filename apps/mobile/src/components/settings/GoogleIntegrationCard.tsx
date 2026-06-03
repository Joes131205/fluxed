import { Alert, Text, View, Linking } from "react-native";
import { SecondaryButton } from "../ui/SecondaryButton";
import { API_URL } from "../../lib/env";

type GoogleIntegrationCardProps = {
    isLinked: boolean;
};

export function GoogleIntegrationCard({
    isLinked,
}: GoogleIntegrationCardProps) {
    const handleGoogleLink = async () => {
        try {
            await Linking.openURL(`${API_URL}/auth/google/start`);
        } catch (error) {
            Alert.alert(
                "Connection Error",
                error instanceof Error ? error.message : "Unexpected error",
            );
        }
    };

    return (
        <View className="border-t border-dashed border-primary/30 pt-5 mb-5">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xs font-bold font-mono uppercase tracking-widest text-muted-foreground">
                    Google Integration
                </Text>
                <Text
                    className={`text-[10px] font-black font-mono uppercase tracking-widest ${isLinked ? "text-primary" : "text-muted-foreground/50"}`}
                >
                    {isLinked ? "[ LINKED ]" : "[ NOT LINKED ]"}
                </Text>
            </View>

            {!isLinked && (
                <SecondaryButton
                    label="Link Account"
                    onPress={handleGoogleLink}
                />
            )}
        </View>
    );
}
