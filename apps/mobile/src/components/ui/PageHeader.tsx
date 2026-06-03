import { Text, View } from "react-native";

type PageHeaderProps = {
    title: string;
    description: string;
    dividerWidthClassName?: string;
};

export function PageHeader({
    title,
    description,
    dividerWidthClassName = "w-24",
}: PageHeaderProps) {
    return (
        <View className="flex flex-col mb-2">
            <Text className="text-2xl font-bold text-primary tracking-tight mb-1">
                {title}
            </Text>
            <View
                className={`h-0.5 bg-primary mb-3 shadow-[0_0_8px_rgba(0,255,65,0.6)] ${dividerWidthClassName}`}
            />
            <Text className="text-xs text-muted-foreground font-mono uppercase tracking-widest leading-5">
                {description}
            </Text>
        </View>
    );
}
