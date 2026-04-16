import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { getAuthHeaders } from "../../lib/authHeaders";
import { usersClient } from "../../lib/client";
import { API_URL } from "../../lib/env";

export default function Settings() {
    const { user, logout } = useAuth();

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [minDuration, setMinDuration] = useState("0");
    const [timeBuffer, setTimeBuffer] = useState("0");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setStartTime((user?.startTime ?? "").slice(0, 5));
        setEndTime((user?.endTime ?? "").slice(0, 5));
        setMinDuration(String(user?.minDuration ?? 0));
        setTimeBuffer(String(user?.timeBuffer ?? 0));
    }, [user]);

    const handleSave = async () => {
        const minDurationNumber = Number(minDuration);
        const timeBufferNumber = Number(timeBuffer);

        if (!startTime || !endTime) {
            Alert.alert("Missing fields", "Start and end time are required.");
            return;
        }

        if (Number.isNaN(minDurationNumber) || Number.isNaN(timeBufferNumber)) {
            Alert.alert("Invalid values", "Durations must be valid numbers.");
            return;
        }

        if (minDurationNumber < 0 || timeBufferNumber < 0) {
            Alert.alert("Invalid values", "Durations cannot be negative.");
            return;
        }

        setIsSaving(true);
        try {
            const headers = await getAuthHeaders();
            const response = await usersClient.time.$put(
                {
                    json: {
                        startTime,
                        endTime,
                        minDuration: minDurationNumber,
                        timeBuffer: timeBufferNumber,
                    },
                },
                { headers },
            );

            if (!response.ok) {
                Alert.alert("Save failed", "Could not update settings.");
                return;
            }

            Alert.alert("Saved", "Your settings were updated.");
        } catch (error) {
            Alert.alert(
                "Save failed",
                error instanceof Error ? error.message : "Unexpected error",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleGoogleLink = async () => {
        try {
            await Linking.openURL(`${API_URL}/api/auth/google/start`);
        } catch (error) {
            Alert.alert(
                "Unable to open link",
                error instanceof Error ? error.message : "Unexpected error",
            );
        }
    };

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="px-5 py-8 flex flex-col gap-10"
        >
            <View className="flex flex-col gap-2">
                <Text className="text-3xl font-bold">Settings</Text>
                <Text className="text-muted-foreground">
                    Tweak your experiences here!
                </Text>
            </View>

            <View className="flex flex-col gap-5">
                <Text className="text-gray-500 font-bold">App settings</Text>
                <View className="flex flex-col gap-4">
                    <View className="rounded-2xl border border-border bg-card p-4">
                        <Text className="mb-2 font-semibold">
                            Start time (HH:mm)
                        </Text>
                        <TextInput
                            className="rounded-xl border border-border px-3 py-3"
                            value={startTime}
                            onChangeText={setStartTime}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="09:00"
                        />
                    </View>

                    <View className="rounded-2xl border border-border bg-card p-4">
                        <Text className="mb-2 font-semibold">
                            End time (HH:mm)
                        </Text>
                        <TextInput
                            className="rounded-xl border border-border px-3 py-3"
                            value={endTime}
                            onChangeText={setEndTime}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="17:00"
                        />
                    </View>

                    <View className="rounded-2xl border border-border bg-card p-4">
                        <Text className="mb-2 font-semibold">
                            Minimum task duration (minutes)
                        </Text>
                        <TextInput
                            className="rounded-xl border border-border px-3 py-3"
                            value={minDuration}
                            onChangeText={setMinDuration}
                            keyboardType="number-pad"
                            placeholder="30"
                        />
                    </View>

                    <View className="rounded-2xl border border-border bg-card p-4">
                        <Text className="mb-2 font-semibold">
                            Buffer between events (minutes)
                        </Text>
                        <TextInput
                            className="rounded-xl border border-border px-3 py-3"
                            value={timeBuffer}
                            onChangeText={setTimeBuffer}
                            keyboardType="number-pad"
                            placeholder="15"
                        />
                    </View>

                    <View className="rounded-2xl border border-border bg-card p-4">
                        <Text className="font-semibold">Google Account</Text>
                        <Text className="mt-1 text-muted-foreground">
                            {user?.googleId ? "Linked" : "Not linked"}
                        </Text>
                        {!user?.googleId && (
                            <Pressable
                                onPress={handleGoogleLink}
                                className="mt-3 rounded-xl border border-border px-4 py-3"
                            >
                                <Text className="text-center font-semibold">
                                    Link Google
                                </Text>
                            </Pressable>
                        )}
                    </View>

                    <Pressable
                        onPress={handleSave}
                        disabled={isSaving}
                        className="rounded-xl bg-primary py-4"
                    >
                        {isSaving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-center font-semibold text-white">
                                Save Settings
                            </Text>
                        )}
                    </Pressable>
                </View>
            </View>

            <View className="flex flex-col gap-5">
                <Text className="text-gray-500 font-bold">Others</Text>
                <Pressable
                    onPress={logout}
                    className="rounded-xl bg-red-500 py-4"
                >
                    <Text className="text-center font-semibold text-white">
                        Log Out
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}
