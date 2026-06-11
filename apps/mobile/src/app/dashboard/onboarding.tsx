import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export const Onboarding = () => {
    const [firstStepDone, setFirstStepDone] = useState(false);
    const [secondStepDone, setSecondStepDone] = useState(false);

    useEffect(() => {
        const getSteps = async () => {
            const firstStep = await AsyncStorage.getItem("first");
            const secondStep = await AsyncStorage.getItem("second");
            if (firstStep !== null && firstStep === "done") {
                setFirstStepDone(true);
            }
            if (secondStep !== null && secondStep === "done") {
                setSecondStepDone(true);
            }
        };
        getSteps();
    }, []);

    return (
        <View>
            {secondStepDone ? null : firstStepDone ? (
                <View>
                    <Text>Second Step</Text>
                    <Text>Checklist here...</Text>
                    <View></View>
                </View>
            ) : (
                <View>
                    <Text>Hello there!</Text>
                    <Text>
                        Before I'll let you roam, get to know our application
                        itself!
                    </Text>
                </View>
            )}
        </View>
    );
};
