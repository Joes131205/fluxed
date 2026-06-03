import { type ReactNode } from "react";
import { View } from "react-native";

type SettingsPanelProps = {
    children: ReactNode;
    className?: string;
};

export function SettingsPanel({
    children,
    className = "",
}: SettingsPanelProps) {
    return (
        <View
            className={`border-2 border-primary bg-background relative p-5 pt-8 mb-2 ${className}`}
        >
            {children}
        </View>
    );
}
