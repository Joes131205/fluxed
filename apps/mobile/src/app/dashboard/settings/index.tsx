import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import {
    Alert,
    Linking,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { getAuthHeaders } from "../../../lib/authHeaders";
import { usersClient } from "../../../lib/client";
import { API_URL } from "../../../lib/env";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { SecondaryButton } from "../../../components/ui/SecondaryButton";
import { TertiaryButton } from "../../../components/ui/TertiaryButton";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Settings() {
    const { user, logout } = useAuth();
    const router = useRouter();

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
            Alert.alert("Syntax Error", "Start and end time are required.");
            return;
        }

        if (Number.isNaN(minDurationNumber) || Number.isNaN(timeBufferNumber)) {
            Alert.alert("Type Error", "Durations must be valid numbers.");
            return;
        }

        if (minDurationNumber < 0 || timeBufferNumber < 0) {
            Alert.alert("Logic Error", "Durations cannot be negative.");
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
                Alert.alert("System Error", "Could not update settings.");
                return;
            }

            Alert.alert("System", "Settings successfully overwritten.");
        } catch (error) {
            Alert.alert(
                "System Error",
                error instanceof Error ? error.message : "Unexpected error",
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleGoogleLink = async () => {
        try {
            await Linking.openURL(`${API_URL}/auth/google/start`);
        } catch (error) {
            Alert.alert(
                "Connection Error",
                error instanceof Error ? error.message : "Unexpected error",
            );
        }
    };

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="flex flex-col gap-6 py-8 px-4"
        >
            <View className="flex flex-col mb-2">
                <Text className="text-2xl font-bold text-primary tracking-tight mb-1">
                    Settings
                </Text>
                <View className="h-[2px] w-24 bg-primary mb-3 shadow-[0_0_8px_rgba(0,255,65,0.6)]" />
                <Text className="text-xs text-muted-foreground font-mono uppercase tracking-widest leading-5">
                    Configure your parameters
                </Text>
            </View>

            <View className="border-2 border-primary bg-background relative p-5 pt-8 mb-2">
                <View className="flex-row gap-3 mb-4">
                    <View className="flex-1 border border-muted bg-card">
                        <Text className="text-[10px] font-black uppercase tracking-widest text-primary/70 px-3 pt-3">
                            Start (HH:MM)
                        </Text>
                        <TextInput
                            className="text-white px-3 py-3 font-mono text-lg outline-none"
                            value={startTime}
                            onChangeText={setStartTime}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="09:00"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                            selectionColor="#00ff41"
                        />
                    </View>

                    <View className="flex-1 border border-muted bg-card">
                        <Text className="text-[10px] font-black uppercase tracking-widest text-primary/70 px-3 pt-3">
                            End (HH:MM)
                        </Text>
                        <TextInput
                            className="text-white px-3 py-3 font-mono text-lg outline-none"
                            value={endTime}
                            onChangeText={setEndTime}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="17:00"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                            selectionColor="#00ff41"
                        />
                    </View>
                </View>

                <View className="flex-row gap-3 mb-6">
                    <View className="flex-1 border border-muted bg-card">
                        <Text
                            className="text-[10px] font-black uppercase tracking-widest text-primary/70 px-3 pt-3"
                            numberOfLines={1}
                        >
                            Min Task (Min)
                        </Text>
                        <TextInput
                            className="text-white px-3 py-3 font-mono text-lg outline-none"
                            value={minDuration}
                            onChangeText={setMinDuration}
                            keyboardType="number-pad"
                            placeholder="30"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                            selectionColor="#00ff41"
                        />
                    </View>

                    <View className="flex-1 border border-muted bg-card">
                        <Text
                            className="text-[10px] font-black uppercase tracking-widest text-primary/70 px-3 pt-3"
                            numberOfLines={1}
                        >
                            Buffer (Min)
                        </Text>
                        <TextInput
                            className="text-white px-3 py-3 font-mono text-lg outline-none"
                            value={timeBuffer}
                            onChangeText={setTimeBuffer}
                            keyboardType="number-pad"
                            placeholder="15"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                            selectionColor="#00ff41"
                        />
                    </View>
                </View>
                <View className="pt-2">
                    <PrimaryButton
                        label={isSaving ? "Saving..." : "Save Settings"}
                        onPress={handleSave}
                        loading={isSaving}
                        disabled={isSaving}
                    />
                </View>
                <View className="border-t border-dashed border-primary/30 pt-5 mb-5">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xs font-bold font-mono uppercase tracking-widest text-muted-foreground">
                            Google Integration
                        </Text>
                        <Text
                            className={`text-[10px] font-black font-mono uppercase tracking-widest ${user?.googleId ? "text-primary" : "text-muted-foreground/50"}`}
                        >
                            {user?.googleId ? "[ LINKED ]" : "[ NOT LINKED ]"}
                        </Text>
                    </View>

                    {!user?.googleId && (
                        <SecondaryButton
                            label="Link Account"
                            onPress={handleGoogleLink}
                        />
                    )}
                </View>
            </View>

            <View className="border border-muted bg-card p-5 mt-2">
                <Text className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-4">
                    Others
                </Text>

                <View className="flex-row gap-3 mb-2">
                    <View className="flex-1">
                        <SecondaryButton
                            label="Edit Areas"
                            onPress={() =>
                                router.navigate("/dashboard/settings/area")
                            }
                        />
                    </View>

                    <View className="flex-1">
                        <SecondaryButton
                            label="Edit Subareas"
                            onPress={() =>
                                router.navigate("/dashboard/settings/subarea")
                            }
                        />
                    </View>
                </View>

                <View className="mt-4 border-t border-muted/50 pt-4">
                    <TertiaryButton
                        label="LogOut"
                        onPress={logout}
                        variant="danger"
                    />
                </View>
            </View>
        </ScrollView>
    );
}
