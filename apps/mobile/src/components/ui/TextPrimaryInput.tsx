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
        <View className="flex flex-col gap-2 w-full">
            {label && (
                <Text className="mb-2 text-xs font-black uppercase tracking-widest text-foreground/80">
                    {label}
                </Text>
            )}
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
                placeholderTextColor="#7c7c7c"
                className="w-full border-4 border-foreground bg-white px-4 py-4 text-base font-bold text-foreground"
            />
        </View>
    );
};
