import { Text, View, Pressable, ScrollView } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace("/");
    };

    return (
        <ScrollView className="flex-1">
            <View className="px-6 py-12">
                <View className="flex-row justify-between items-center mb-8">
                    <View className="flex-1">
                        <Text className="text-3xl font-bold text-gray-900">
                            Hello World
                        </Text>
                    </View>
                    <Pressable
                        onPress={handleLogout}
                        className="bg-red-500 px-5 py-2 rounded-lg"
                    >
                        <Text className="text-white font-semibold">Logout</Text>
                    </Pressable>
                </View>

                <View className="gap-4">
                    <View className="bg-white rounded-xl shadow-md p-5">
                        <Text className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                            Username
                        </Text>
                        <Text className="text-xl font-bold text-gray-900">
                            {user?.username || "N/A"}
                        </Text>
                    </View>

                    <View className="bg-white rounded-xl shadow-md p-5">
                        <Text className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                            Email
                        </Text>
                        <Text className="text-base font-semibold text-gray-900">
                            {user?.email}
                        </Text>
                    </View>

                    <View className="bg-white rounded-xl shadow-md p-5">
                        <Text className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                            User ID
                        </Text>
                        <Text className="text-xs font-mono text-gray-900">
                            {user?.id}
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
