import { type ReactNode } from "react";
import { View } from "react-native";

type CategoryFormCardProps = {
    children: ReactNode;
};

export function CategoryFormCard({ children }: CategoryFormCardProps) {
    return (
        <View className="border-2 border-primary bg-background relative pt-6 pb-4 px-4">
            {children}
        </View>
    );
}
