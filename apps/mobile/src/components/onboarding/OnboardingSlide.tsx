import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const slides = [
    {
        title: "Dynamic Rescheduling",
        desc: "Welcome to Fluxed. Traditional calendars fail when life happens. We dynamically redistribute your available minutes based on your priorities.",
    },
    {
        title: "Adapt on the Fly",
        desc: "Derailed by a sudden event? Add a temporary task or skip a planned area. We will instantly recalculate the rest of your day.",
    },
    {
        title: "Calendar Sync",
        desc: "Connect your Google Calendar to fetch your existing meetings. We will automatically schedule your focus work in the free gaps between them. (ONLY if you linked your Google Account)",
    },
];

type OnboardingSlideProps = {
    onFinish: () => void;
};
const OnboardingSlide = ({ onFinish }: OnboardingSlideProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onFinish();
        }
    };

    const currentSlide = slides[currentIndex];
    return (
        <View className="flex flex-col border border-muted bg-card p-6 mt-6 mb-8 min-h-62.5 justify-between">
            <View>
                <Text className="text-xl font-bold text-primary mb-4 tracking-tight">
                    {currentSlide.title}
                </Text>

                <Text className="text-sm text-foreground/80 leading-6">
                    {currentSlide.desc}
                </Text>
            </View>

            <View className="flex-col gap-10 items-center justify-between mt-8">
                <View className="flex-row gap-2 h-1.5 w-full">
                    <View
                        className="h-full bg-primary"
                        style={{
                            width: `${((currentIndex + 1) / slides.length) * 100}%`,
                        }}
                    ></View>
                </View>

                <Pressable
                    onPress={handleNext}
                    className="border border-primary px-4 py-2 bg-primary/10 active:bg-primary/20"
                >
                    <Text className="text-primary font-mono font-bold text-xs">
                        {currentIndex === slides.length - 1
                            ? "Let's Go!"
                            : "Next"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default OnboardingSlide;
