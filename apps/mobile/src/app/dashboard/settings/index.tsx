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
            await Linking.openURL(`${API_URL}/auth/google/start`);
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
            contentContainerClassName=" flex flex-col gap-5 py-10 px-4"
        >
            <View className="flex flex-col pb-6 mb-6 border-b-2 border-dashed border-white/30">
                <Text
                    className="text-2xl text-white uppercase"
                    style={{ fontFamily: "PressStart2P_400Regular" }}
                >
                    Settings
                </Text>

                <Text className="mt-3 text-xs text-white/70 font-mono uppercase tracking-widest leading-5">
                    Tweak your settings here
                </Text>
            </View>

            <View className="flex flex-col">
                <Text className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-6">
                    Time Parameters
                </Text>

                <View className="flex-row gap-4 mb-5">
                    <View className="flex-1 flex flex-col gap-2">
                        <Text className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">
                            Start (HH:MM)
                        </Text>
                        <TextInput
                            className="rounded-xl border border-white/20 bg-[#0A0A0A] text-white px-4 py-4 font-mono text-center"
                            value={startTime}
                            onChangeText={setStartTime}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="09:00"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                            selectionColor="#ffffff"
                        />
                    </View>

                    <View className="flex-1 flex flex-col gap-2">
                        <Text className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">
                            End (HH:MM)
                        </Text>
                        <TextInput
                            className="rounded-xl border border-white/20 bg-[#0A0A0A] text-white px-4 py-4 font-mono text-center"
                            value={endTime}
                            onChangeText={setEndTime}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="17:00"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                            selectionColor="#ffffff"
                        />
                    </View>
                </View>

                <View className="flex-row gap-4 mb-6">
                    <View className="flex-1 flex flex-col gap-2">
                        <Text
                            className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1"
                            numberOfLines={1}
                        >
                            Min Task (Min)
                        </Text>
                        <TextInput
                            className="rounded-xl border border-white/20 bg-[#0A0A0A] text-white px-4 py-4 font-mono text-center"
                            value={minDuration}
                            onChangeText={setMinDuration}
                            keyboardType="number-pad"
                            placeholder="30"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                            selectionColor="#ffffff"
                        />
                    </View>

                    <View className="flex-1 flex flex-col gap-2">
                        <Text
                            className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1"
                            numberOfLines={1}
                        >
                            Buffer (Min)
                        </Text>
                        <TextInput
                            className="rounded-xl border border-white/20 bg-[#0A0A0A] text-white px-4 py-4 font-mono text-center"
                            value={timeBuffer}
                            onChangeText={setTimeBuffer}
                            keyboardType="number-pad"
                            placeholder="15"
                            placeholderTextColor="rgba(255, 255, 255, 0.2)"
                            selectionColor="#ffffff"
                        />
                    </View>
                </View>

                <View className="border-t border-dashed border-white/10 pt-6 mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-[10px] font-black uppercase tracking-widest text-white/50 ml-1">
                            Google Integration
                        </Text>
                        <Text
                            className={`text-[10px] font-black uppercase tracking-widest ${user?.googleId ? "text-green-400" : "text-white/30"}`}
                        >
                            {user?.googleId ? "Linked" : "Not Linked"}
                        </Text>
                    </View>

                    {!user?.googleId && (
                        <SecondaryButton
                            label="Link Account"
                            onPress={handleGoogleLink}
                        />
                    )}
                </View>

                <PrimaryButton
                    label="Save"
                    onPress={handleSave}
                    loading={isSaving}
                    disabled={isSaving}
                />
            </View>

            <View className="flex flex-col gap-4">
                <Text className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">
                    Others
                </Text>

                <View className="flex-row gap-4 mb-2">
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

                <TertiaryButton
                    label="Log Out"
                    onPress={logout}
                    variant="danger"
                />
            </View>
        </ScrollView>
    );
}
