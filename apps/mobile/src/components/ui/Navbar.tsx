import { Pressable, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

export const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        {
            label: "Home",
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

    if (hiddenLinks.includes(pathname)) {
        return null;
    }

    return (
        <View className="border-t border-dashed border-white/20 bg-[#0A0A0A] pt-2 pb-8 px-4 flex-row items-center justify-between">
            {navItems.map((item) => {
                const isActive = pathname === item.to;

                return (
                    <Pressable
                        key={item.to}
                        onPress={() => router.push(item.to)}
                        className={`flex-1 items-center justify-center py-3 rounded-xl transition-colors ${
                            isActive ? "bg-white/10" : "bg-transparent"
                        }`}
                    >
                        <Ionicons
                            name={
                                isActive ? item.activeIcon : item.inactiveIcon
                            }
                            size={22}
                            color={
                                isActive
                                    ? "#ffffff"
                                    : "rgba(255, 255, 255, 0.4)"
                            }
                        />
                        <Text
                            numberOfLines={1}
                            className={`w-full text-center text-[10px] uppercase tracking-widest mt-1.5 ${
                                isActive
                                    ? "font-black text-white"
                                    : "font-bold text-white/40"
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
