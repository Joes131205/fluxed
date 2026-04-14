import { Pressable, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        {
            label: "Dashboard",
            to: "/dashboard",
            activeIcon: "home" as IconName,
            inactiveIcon: "home-outline" as IconName,
        },
        {
            label: "Reschedule",
            to: "/dashboard/reschedule",
            activeIcon: "shuffle" as IconName,
            inactiveIcon: "shuffle-outline" as IconName,
        },
        {
            label: "Categories",
            to: "/dashboard/categories",
            activeIcon: "grid" as IconName,
            inactiveIcon: "grid-outline" as IconName,
        },
        {
            label: "Settings",
            to: "/dashboard/settings",
            activeIcon: "settings" as IconName,
            inactiveIcon: "settings-outline" as IconName,
        },
    ];

    const hiddenLinks = ["/sign-in", "/sign-up", "/"];

    return (
        <View className={`${hiddenLinks.includes(pathname) ? "hidden" : ""}`}>
            <View className="flex-row items-center justify-between bg-white p2">
                {navItems.map((item) => {
                    const isActive = pathname === item.to;

                    return (
                        <Pressable
                            key={item.to}
                            onPress={() => router.push(item.to)}
                            className="flex-1 items-center rounded-2xl px-1 py-2"
                        >
                            <Ionicons
                                name={
                                    isActive
                                        ? item.activeIcon
                                        : item.inactiveIcon
                                }
                                size={24}
                                color={isActive ? "#00cdfd" : "#6b7280"}
                            />
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="clip"
                                adjustsFontSizeToFit
                                minimumFontScale={0.8}
                                className={`w-full text-center text-xs ${
                                    isActive ? "font-bold" : "font-medium"
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
