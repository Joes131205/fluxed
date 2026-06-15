import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { usePlans } from "../../hooks/usePlans";
import { useAreas } from "../../hooks/useAreas";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { PlanCard } from "./PlanCard";

type PlanItem = {
    id: string;
    sessionId: string;
    startTime: string;
    endTime: string;
    minutes: number;
    subareaId: string;
    subareaName: string;
    subareaWeight: number | null;
    areaName: string;
    subareaColor: string;
    areaColor: string;
};

export const PlanSection = () => {
    const { data: plansData, isLoading: isPlansLoading } = usePlans();
    const { data: areasData, isLoading: isAreasLoading } = useAreas();
    const router = useRouter();
    const [progress, setProgress] = useState<string[]>([]);
    const [now, setNow] = useState(new Date());
    const [hasLoadedProgress, setHasLoadedProgress] = useState(false);

    const areas = areasData?.ok ? (areasData.data as any[]) : [];
    const planItems: PlanItem[] = plansData?.ok
        ? (plansData.data as PlanItem[])
        : [];
    const length = planItems.length;

    const toggleEventCompletion = (id: string) => {
        setProgress((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id],
        );
    };

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const data = await AsyncStorage.getItem("progress");
                if (data) setProgress(JSON.parse(data));
            } catch {
                setProgress([]);
            } finally {
                setHasLoadedProgress(true);
            }
        };
        loadProgress();
    }, []);

    useEffect(() => {
        if (!hasLoadedProgress) return;
        AsyncStorage.setItem("progress", JSON.stringify(progress)).catch(
            () => undefined,
        );
    }, [hasLoadedProgress, progress]);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <View className="flex flex-col gap-5 pb-10">
            <View className="border-b border-muted pb-2 mb-2">
                <Text className="text-sm text-primary uppercase tracking-widest font-bold">
                    Schedule
                </Text>
            </View>

            <View className="mb-4">
                <View className="flex-row justify-between items-end mb-2">
                    <Text className="text-foreground/50 font-bold text-[10px] uppercase tracking-widest">
                        Timeline Progress
                    </Text>
                    <Text className="text-primary text-xs font-mono font-bold">
                        [{progress.length}/{length}]
                    </Text>
                </View>
                <View className="w-full h-4 bg-background border border-primary p-0.5">
                    <View
                        className="h-full bg-primary transition-all duration-500 shadow-md shadow-primary"
                        style={{
                            width: `${length > 0 ? (progress.length / length) * 100 : 0}%`,
                        }}
                    />
                </View>
            </View>

            {isPlansLoading && (
                <View className="py-10 border border-primary/30 items-center justify-center">
                    <ActivityIndicator size="small" className="text-primary" />
                </View>
            )}

            {!isPlansLoading && planItems.length > 0 && (
                <View className="flex flex-col gap-2">
                    {planItems.map((item, idx) => {
                        const isCompleted = progress.includes(item.id);
                        const startTime = new Date(item.startTime);
                        const endTime = new Date(item.endTime);
                        const isNow = now >= startTime && now <= endTime;
                        const isPassed = now >= endTime;
                        const hasNotStarted = !isNow && !isPassed;

                        return (
                            <PlanCard
                                key={item.id}
                                item={item}
                                idx={idx}
                                totalItems={length}
                                isCompleted={isCompleted}
                                isNow={isNow}
                                isPassed={isPassed}
                                hasNotStarted={hasNotStarted}
                                toggleEventCompletion={toggleEventCompletion}
                            />
                        );
                    })}
                </View>
            )}
        </View>
    );
};
