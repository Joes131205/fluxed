import { Text, View } from "react-native";
import { SecondaryButton } from "../ui/SecondaryButton";
import { Uniwind, useUniwind } from "uniwind";

export function ThemeSettingsCard() {
    const { theme } = useUniwind();

    const toggleTheme = () => {
        Uniwind.setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <View className="border-t border-dashed border-primary/30 pt-5 mb-5 mt-5">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xs font-bold font-mono uppercase tracking-widest text-muted-foreground">
                    Appearance
                </Text>
                <Text className="text-[10px] font-black font-mono uppercase tracking-widest text-primary">
                    [ {theme.toUpperCase()} ]
                </Text>
            </View>

            <SecondaryButton
                label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                onPress={toggleTheme}
            />
        </View>
    );
}
