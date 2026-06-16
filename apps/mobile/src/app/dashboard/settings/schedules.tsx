import { useState } from "react";
import {
    ScrollView,
    View,
    Text,
    Pressable,
    TextInput,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PageHeader } from "../../../components/ui/PageHeader";
import { BackButton } from "../../../components/ui/BackButton";
import {
    useSchedules,
    useCreateSchedule,
    useDeleteSchedule,
} from "../../../hooks/useSchedules";

export default function Schedules() {
    const { data: schedulesData, isLoading } = useSchedules();
    const { mutate: createSchedule, isPending: isCreating } =
        useCreateSchedule();
    const { mutate: deleteSchedule, isPending: isDeleting } =
        useDeleteSchedule();

    const [name, setName] = useState("");
    const [timeSlots, setTimeSlots] = useState<
        { start: string; end: string }[]
    >([{ start: "", end: "" }]);

    const schedules = schedulesData?.ok ? (schedulesData.data as any[]) : [];

    const handleAddSlot = () => {
        setTimeSlots([...timeSlots, { start: "", end: "" }]);
    };

    const handleRemoveSlot = (index: number) => {
        if (timeSlots.length > 1) {
            setTimeSlots(timeSlots.filter((_, i) => i !== index));
        }
    };

    const handleSlotChange = (
        index: number,
        field: "start" | "end",
        value: string,
    ) => {
        let formattedValue = value.replace(/[^0-9:]/g, "");
        if (
            formattedValue.length === 2 &&
            !formattedValue.includes(":") &&
            value.length === 2
        ) {
            formattedValue += ":";
        }

        const newSlots = [...timeSlots];
        newSlots[index][field] = formattedValue;
        setTimeSlots(newSlots);
    };

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert("Error", "Schedule name cannot be empty");
            return;
        }

        const isValid = timeSlots.every(
            (slot) =>
                slot.start.length === 5 &&
                slot.end.length === 5 &&
                slot.start.includes(":") &&
                slot.end.includes(":"),
        );

        if (!isValid) {
            Alert.alert(
                "Format Error",
                "Please use HH:mm format (e.g., 09:00)",
            );
            return;
        }

        createSchedule(
            { name: name.trim(), timeSlots },
            {
                onSuccess: () => {
                    setName("");
                    setTimeSlots([{ start: "", end: "" }]);
                },
            },
        );
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this routine?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteSchedule(id),
                },
            ],
        );
    };

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="flex flex-col gap-6 py-8 px-4"
        >
            <BackButton />

            <PageHeader
                title="Fixed Routines"
                description="Manage your static time blocks and events"
                dividerWidthClassName="w-48"
            />

            <View className="flex flex-col gap-3">
                <Text className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-1">
                    Current Routines
                </Text>

                {isLoading ? (
                    <ActivityIndicator
                        size="small"
                        className="color-primary my-4"
                    />
                ) : schedules.length === 0 ? (
                    <View className="border border-dashed border-muted p-6 items-center">
                        <Text className="text-muted-foreground font-mono text-xs italic">
                            No routines defined yet.
                        </Text>
                    </View>
                ) : (
                    schedules.map((schedule) => (
                        <View
                            key={schedule.id}
                            className="border border-primary/30 bg-card p-4"
                        >
                            <View className="flex-row justify-between items-start mb-3">
                                <Text className="text-primary font-bold uppercase tracking-widest flex-1">
                                    {schedule.name}
                                </Text>
                                <Pressable
                                    onPress={() => handleDelete(schedule.id)}
                                    disabled={isDeleting}
                                    className="p-1 px-2 border border-destructive/30 active:bg-destructive/10"
                                >
                                    <Text className="text-[10px] font-mono text-destructive tracking-widest uppercase">
                                        Delete
                                    </Text>
                                </Pressable>
                            </View>

                            <View className="flex flex-col gap-1.5 border-t border-primary/20 pt-3">
                                {schedule.timeSlots.map(
                                    (slot: any, idx: number) => (
                                        <View
                                            key={idx}
                                            className="flex-row items-center gap-2"
                                        >
                                            <Text className="text-foreground/50 font-mono text-[10px]">
                                                {">"}
                                            </Text>
                                            <View className="bg-primary/10 px-2 py-0.5 border border-primary/20">
                                                <Text className="text-primary font-mono text-xs font-bold">
                                                    {slot.start}
                                                </Text>
                                            </View>
                                            <Text className="text-foreground/50 font-mono text-[10px]">
                                                UNTIL
                                            </Text>
                                            <View className="bg-primary/10 px-2 py-0.5 border border-primary/20">
                                                <Text className="text-primary font-mono text-xs font-bold">
                                                    {slot.end}
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                )}
                            </View>
                        </View>
                    ))
                )}
            </View>

            <View className="mt-4 pt-6 border-t border-dashed border-primary/30">
                <Text className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-4">
                    Create New Routine
                </Text>

                <View className="flex flex-col gap-4">
                    <View className="border border-primary/50 bg-background focus-within:border-primary px-3">
                        <Text className="text-[9px] font-mono text-primary/50 uppercase mt-2">
                            Routine Name
                        </Text>
                        <TextInput
                            className="text-foreground font-mono text-sm py-2 outline-none"
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g., Campus Classes"
                            placeholderTextColor="#737373"
                        />
                    </View>

                    <View className="flex flex-col gap-2">
                        <Text className="text-[9px] font-mono text-primary/50 uppercase">
                            Time Slots (HH:mm)
                        </Text>

                        {timeSlots.map((slot, index) => (
                            <View
                                key={index}
                                className="flex-row items-center gap-2"
                            >
                                <View className="flex-1 flex-row items-center border border-primary/30 px-2 bg-card">
                                    <TextInput
                                        className="flex-1 text-foreground font-mono text-sm py-2 text-center outline-none"
                                        value={slot.start}
                                        onChangeText={(val) =>
                                            handleSlotChange(
                                                index,
                                                "start",
                                                val,
                                            )
                                        }
                                        placeholder="09:00"
                                        placeholderTextColor="#737373"
                                        maxLength={5}
                                        keyboardType="numbers-and-punctuation"
                                    />
                                    <Text className="text-primary/50 font-mono text-xs mx-1">
                                        -
                                    </Text>
                                    <TextInput
                                        className="flex-1 text-foreground font-mono text-sm py-2 text-center outline-none"
                                        value={slot.end}
                                        onChangeText={(val) =>
                                            handleSlotChange(index, "end", val)
                                        }
                                        placeholder="11:00"
                                        placeholderTextColor="#737373"
                                        maxLength={5}
                                        keyboardType="numbers-and-punctuation"
                                    />
                                </View>

                                <Pressable
                                    onPress={() => handleRemoveSlot(index)}
                                    disabled={timeSlots.length === 1}
                                    className={`p-2 border border-destructive/30 ${timeSlots.length === 1 ? "opacity-30" : "active:bg-destructive/10"}`}
                                >
                                    <Ionicons
                                        name="close"
                                        size={18}
                                        className="color-destructive"
                                    />
                                </Pressable>
                            </View>
                        ))}
                    </View>

                    <Pressable
                        onPress={handleAddSlot}
                        className="border border-dashed border-primary/50 py-2 items-center active:bg-primary/5"
                    >
                        <Text className="text-[10px] font-mono text-primary uppercase tracking-widest">
                            + Add Another Block
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={handleSave}
                        disabled={isCreating}
                        className={`mt-2 py-3 items-center shadow-lg shadow-primary/20 transition-colors ${
                            isCreating
                                ? "bg-primary/50 border border-primary/50"
                                : "bg-primary border border-primary"
                        }`}
                    >
                        {isCreating ? (
                            <ActivityIndicator size="small" color="#000000" />
                        ) : (
                            <Text className="text-background font-black uppercase tracking-widest text-xs">
                                Save Routine
                            </Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}
