import React, { useState } from "react";
import {
    Text,
    TextInput,
    View,
    Pressable,
    type KeyboardTypeOptions,
    type TextInputProps,
} from "react-native";

type TextPrimaryInputProps = {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
    editable?: boolean;
    autoCapitalize?: TextInputProps["autoCapitalize"];
    textContentType?: TextInputProps["textContentType"];
    autoCorrect?: boolean;
};

export const TextPrimaryInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    secureTextEntry,
    editable = true,
    autoCapitalize,
    textContentType,
    autoCorrect,
}: TextPrimaryInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hidden, setHidden] = useState<boolean>(!!secureTextEntry);

    return (
        <View className="w-full mb-6">
            <Text
                className={`mb-2 text-[10px] font-black uppercase tracking-widest ${isFocused ? "text-primary" : "text-white/50"}`}
            >
                {label}
            </Text>

            <View
                className={`flex-row items-center border-2 px-4 py-1 transition-colors ${
                    isFocused
                        ? "border-primary bg-primary/5 shadow-[0_0_8px_rgba(0,255,65,0.2)]"
                        : "border-white/30 bg-black"
                }`}
            >
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={hidden}
                    editable={editable}
                    autoCapitalize={autoCapitalize}
                    textContentType={textContentType}
                    autoCorrect={autoCorrect}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholderTextColor="rgba(255, 255, 255, 0.2)"
                    className="flex-1 text-white font-mono text-base outline-none"
                    selectionColor="#00ff41"
                />
            </View>

            {secureTextEntry ? (
                <View className="w-full mt-2 flex-row justify-end">
                    <Pressable onPress={() => setHidden((s) => !s)}>
                        <Text className="text-xs font-mono text-primary/80">
                            {hidden ? "Show" : "Hide"}
                        </Text>
                    </Pressable>
                </View>
            ) : null}
        </View>
    );
};
