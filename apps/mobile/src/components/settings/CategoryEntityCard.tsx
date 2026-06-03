import { type ReactNode } from "react";
import { Text, View } from "react-native";

type CategoryEntityCardProps = {
    children: ReactNode;
};

export function CategoryEntityCard({ children }: CategoryEntityCardProps) {
    return <View className="border border-muted bg-card">{children}</View>;
}

type CategoryEntityEditCardProps = {
    children: ReactNode;
};

export function CategoryEntityEditCard({
    children,
}: CategoryEntityEditCardProps) {
    return (
        <View className="p-4 border-2 border-primary bg-background relative">
            <View className="mt-2 flex flex-col gap-2">{children}</View>
        </View>
    );
}

type CategoryEntityRowProps = {
    children: ReactNode;
};

export function CategoryEntityRow({ children }: CategoryEntityRowProps) {
    return (
        <View className="p-4 flex-row items-center justify-between">
            {children}
        </View>
    );
}

type CategoryEntityEmptyStateProps = {
    icon: ReactNode;
    title: string;
    description: string;
};

export function CategoryEntityEmptyState({
    icon,
    title,
    description,
}: CategoryEntityEmptyStateProps) {
    return (
        <View className="border border-dashed border-muted p-6 items-center bg-card mt-4">
            {icon}
            <Text className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-4">
                {title}
            </Text>
            <Text className="text-xs font-mono text-primary/50 mt-2 text-center">
                {description}
            </Text>
        </View>
    );
}
