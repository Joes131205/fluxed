import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View, Pressable } from "react-native";

export default function App() {
    const router = useRouter();
    return (
        <View className="flex flex-col items-center justify-center flex-1 gap-5">
            <Text>Hello World!</Text>
            <Pressable
                onPress={() => {
                    router.navigate("/sign-up");
                }}
                className="bg-blue-500 px-6 py-3 rounded-lg"
            >
                <Text className="text-white font-semibold">Sign Up</Text>
            </Pressable>
            <Pressable
                onPress={() => {
                    router.navigate("/sign-in");
                }}
                className="bg-blue-500 px-6 py-3 rounded-lg"
            >
                <Text className="text-white font-semibold">Sign In</Text>
            </Pressable>
        </View>
    );
}
