import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { getAuthHeaders } from "../../../lib/authHeaders";
import { usersClient } from "../../../lib/client";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import { SettingsActionsCard } from "../../../components/settings/SettingsActionsCard";
import { SettingsPanel } from "../../../components/settings/SettingsPanel";
import { SettingsTimeFields } from "../../../components/settings/SettingsTimeFields";
import { GoogleIntegrationCard } from "../../../components/settings/GoogleIntegrationCard";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Uniwind } from "uniwind";

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

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="flex flex-col gap-6 py-8 px-4"
        >
            <PageHeader
                title="Settings"
                description="Configure your settings here"
            />

            <SettingsPanel>
                <SettingsTimeFields
                    startTime={startTime}
                    endTime={endTime}
                    minDuration={minDuration}
                    timeBuffer={timeBuffer}
                    onStartTimeChange={setStartTime}
                    onEndTimeChange={setEndTime}
                    onMinDurationChange={setMinDuration}
                    onTimeBufferChange={setTimeBuffer}
                />

                <View className="pt-2">
                    <PrimaryButton
                        label={isSaving ? "Saving..." : "Save Settings"}
                        onPress={handleSave}
                        loading={isSaving}
                        disabled={isSaving}
                    />
                </View>

                <GoogleIntegrationCard isLinked={!!user?.googleId} />
            </SettingsPanel>

            <SettingsActionsCard
                onToggleTheme={() =>
                    Uniwind.setTheme(
                        Uniwind.currentTheme === "dark" ? "light" : "dark",
                    )
                }
                onEditAreas={() => router.navigate("/dashboard/settings/area")}
                onEditSubareas={() =>
                    router.navigate("/dashboard/settings/subarea")
                }
                onSubareaActions={() =>
                    router.navigate("/dashboard/settings/subarea-actions")
                }
                onSchedules={() =>
                    router.navigate("/dashboard/settings/schedules")
                }
                onLogout={logout}
            />
        </ScrollView>
    );
}
