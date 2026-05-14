import React from "react";
import {
    Text,
    TextInput,
    View,
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
    return (
        <View className="w-full mb-6">
            <Text className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/50">
                {label}
            </Text>

            <View className="flex-row items-center border-2 border-white/30 bg-black px-4 py-4">
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    editable={editable}
                    autoCapitalize={autoCapitalize}
                    textContentType={textContentType}
                    autoCorrect={autoCorrect}
                    placeholderTextColor="rgba(255, 255, 255, 0.2)"
                    className="flex-1 text-white font-mono text-base"
                    selectionColor="#ffffff"
                />
            </View>
        </View>
    );
};
