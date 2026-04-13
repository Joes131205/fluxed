import React, { useState } from "react";
import { View } from "react-native";

export default function Categories() {
    const [category, setCategory] = useState<"area" | "subarea">("area");
    return <View></View>;
}
