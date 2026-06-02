import { Pressable, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        {
            label: "HOME",
            to: "/dashboard",
            activeIcon: "terminal" as IconName,
            inactiveIcon: "terminal-outline" as IconName,
        },
        {
            label: "RESCHEDULE",
            to: "/dashboard/reschedule",
            activeIcon: "time" as IconName,
            inactiveIcon: "time-outline" as IconName,
        },
        {
            label: "CATEGORIES",
            to: "/dashboard/categories",
            activeIcon: "shapes" as IconName,
            inactiveIcon: "shapes-outline" as IconName,
        },
        {
            label: "SETTINGS",
            to: "/dashboard/settings",
            activeIcon: "cog" as IconName,
            inactiveIcon: "cog-outline" as IconName,
        },
    ];

    const hiddenLinks = ["/sign-in", "/sign-up", "/"];

    if (hiddenLinks.includes(pathname)) {
        return null;
    }

    return (
        <View className="border-t border-border bg-card flex-row items-center justify-between pb-6 pt-2 px-2">
            {navItems.map((item) => {
                const isActive = pathname === item.to;

                return (
                    <Pressable
                        key={item.to}
                        onPress={() => router.push(item.to)}
                        className="flex-1 items-center justify-center py-2 relative"
                    >
                        {isActive && (
                            <View className="absolute top-0 w-10 h-0.5 bg-primary shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
                        )}

                        <Ionicons
                            name={
                                isActive ? item.activeIcon : item.inactiveIcon
                            }
                            size={22}
                            color={isActive ? "#00ff41" : "#3a6b3a"}
                        />
                        <Text
                            numberOfLines={1}
                            className={`w-full text-center text-[10px] uppercase tracking-widest mt-1.5 ${
                                isActive
                                    ? "text-primary font-bold"
                                    : "text-muted-foreground font-medium"
                            }`}
                        >
                            {item.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};
