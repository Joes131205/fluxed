import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Text, View, TextInput } from "react-native";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import OnboardingSlide from "../../components/onboarding/OnboardingSlide";
import { useAreas } from "../../hooks/useAreas";
import { usePlans } from "../../hooks/usePlans";
import { useAuth } from "../../hooks/useAuth";

export const Onboarding = () => {
    const [firstStepDone, setFirstStepDone] = useState(false);
    const [secondStepDone, setSecondStepDone] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const { data: areasData } = useAreas();
    const { data: plansData } = usePlans();
    const { user } = useAuth();

    const hasAreas = areasData?.data && areasData.data.length > 0;
    const hasPlan = plansData?.data && plansData.data.length > 0;
    const isGoogleLinked = !!user?.googleId;

    const isMandatoryDone = hasAreas && hasPlan;
    useEffect(() => {
        const getSteps = async () => {
            const firstStep = await AsyncStorage.getItem("first");
            const secondStep = await AsyncStorage.getItem("second");

            if (firstStep === "done") setFirstStepDone(true);
            if (secondStep === "done") setSecondStepDone(true);

            setIsReady(true);
        };
        getSteps();
    }, []);

    const startStepTwo = async () => {
        await AsyncStorage.setItem("first", "done");
        setFirstStepDone(true);
    };

    const completeOnboarding = async () => {
        await AsyncStorage.setItem("second", "done");
        setSecondStepDone(true);
    };

    if (!isReady || (firstStepDone && secondStepDone)) {
        return null;
    }

    if (!firstStepDone) {
        return (
            <View
                className="absolute inset-0 z-50 bg-background justify-center px-6"
                style={{ elevation: 10 }}
            >
                <View className="flex flex-col">
                    <Text className="text-3xl font-bold text-foreground tracking-tighter text-center">
                        Welcome to Fluxed!
                    </Text>

                    <OnboardingSlide onFinish={startStepTwo} />
                </View>
            </View>
        );
    }

    return (
        <View className="mx-4 mb-4 p-4 border border-primary bg-background shadow-[0_0_10px_rgba(0,140,35,0.2)]">
            <Text className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                Quick Setup
            </Text>

            <View className="flex flex-col gap-4">
                <View className="flex-row gap-3">
                    <Text
                        className={`font-mono text-base ${hasAreas ? "text-primary" : "text-muted-foreground"}`}
                    >
                        {hasAreas ? "[V]" : "[ ]"}
                    </Text>
                    <View className="flex-1 flex-col">
                        <Text
                            className={`font-bold ${hasAreas ? "text-primary line-through" : "text-foreground"}`}
                        >
                            1. Define Categories
                        </Text>
                        <Text className="text-xs text-muted-foreground leading-4 mt-1">
                            Go to "Categories" tab to create your first Area and
                            Subarea.
                        </Text>
                    </View>
                </View>

                <View className="flex-row gap-3">
                    <Text
                        className={`font-mono text-base ${hasPlan ? "text-primary" : "text-muted-foreground"}`}
                    >
                        {hasPlan ? "[V]" : "[ ]"}
                    </Text>
                    <View className="flex-1 flex-col">
                        <Text
                            className={`font-bold ${hasPlan ? "text-primary line-through" : "text-foreground"}`}
                        >
                            2. Generate First Plan
                        </Text>
                        <Text className="text-xs text-muted-foreground leading-4 mt-1">
                            Go to "Reschedule" tab to run the engine and
                            generate a plan.
                        </Text>
                    </View>
                </View>

                <View className="h-px bg-white/10 my-1 w-full" />
                <Text className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                    Optional Setup
                </Text>

                <View className="flex-row gap-3">
                    <Text
                        className={`font-mono text-base ${isGoogleLinked ? "text-primary" : "text-muted-foreground"}`}
                    >
                        {isGoogleLinked ? "[V]" : "[ ]"}
                    </Text>
                    <View className="flex-1 flex-col">
                        <Text
                            className={`font-bold ${isGoogleLinked ? "text-primary line-through" : "text-foreground"}`}
                        >
                            Link Google Calendar
                        </Text>
                        <Text className="text-xs text-muted-foreground leading-4 mt-1">
                            Go to Settings to unlock automatic busy block
                            detection.
                        </Text>
                    </View>
                </View>
            </View>

            {isMandatoryDone && (
                <View className="mt-5 pt-4 border-t border-primary/20">
                    <PrimaryButton
                        label="Dismiss"
                        onPress={completeOnboarding}
                    />
                </View>
            )}
        </View>
    );
};
