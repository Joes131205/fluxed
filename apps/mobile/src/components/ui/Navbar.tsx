import { Pressable, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";

export const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", to: "/dashboard" },
        { label: "Reschedule", to: "/dashboard/reschedule" },
    ];

    return (
        <View className="absolute bottom-4 left-4 right-4">
            <View className="flex-row items-center justify-between rounded-3xl border border-border bg-background/95 px-3 py-3 shadow-lg">
                {navItems.map((item) => {
                    const isActive = pathname === item.to;

                    return (
                        <Pressable
                            key={item.to}
                            onPress={() => router.push(item.to)}
                            className={`flex-1 items-center rounded-2xl px-4 py-3 ${
                                isActive ? "bg-primary" : "bg-transparent"
                            }`}
                        >
                            <Text
                                className={`text-sm font-semibold ${
                                    isActive
                                        ? "text-primary-foreground"
                                        : "text-foreground/70"
                                }`}
                            >
                                {item.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};
