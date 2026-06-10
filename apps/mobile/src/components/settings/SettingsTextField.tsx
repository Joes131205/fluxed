import { Text, TextInput, View } from "react-native";

type SettingsTextFieldProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    keyboardType?:
        | "default"
        | "number-pad"
        | "numeric"
        | "email-address"
        | "phone-pad";
};

export function SettingsTextField({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
}: SettingsTextFieldProps) {
    return (
        <View className="flex-1 border border-muted bg-card">
            <Text className="text-[10px] font-black uppercase tracking-widest text-primary/70 px-3 pt-3">
                {label}
            </Text>
            <TextInput
                className="text-foreground px-3 py-3 font-mono text-lg outline-none"
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={placeholder}
                placeholderTextColor="rgba(255, 255, 255, 0.2)"
                selectionColor="#00ff41"
                keyboardType={keyboardType}
            />
        </View>
    );
}
