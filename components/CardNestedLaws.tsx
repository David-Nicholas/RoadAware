import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

interface CardNestedLawsProps {
    title: string;
    values: { [key: string]: string };
}

export default function CardNestedLaws({ title, values }: CardNestedLawsProps) {
    const { theme } = useContext(ThemeContext);
    const themeColors = Colors[theme];

    return (
        <View
            style={[
                styles.card,
                { borderColor: themeColors.primary, backgroundColor: themeColors.background },
            ]}
        >
            <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
            <View style={styles.valuesContainer}>
                {Object.keys(values).map((key) => (
                    <View key={key} style={styles.valueRow}>
                        <Text style={[styles.key, { color: themeColors.text }]}>{key}:</Text>
                        <Text style={[styles.value, { color: themeColors.text }]}>
                            {values[key]}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    valuesContainer: {
        marginLeft: 16,
    },
    valueRow: {
        flexDirection: "row",
        marginBottom: 4,
    },
    key: {
        fontSize: 14,
        fontWeight: "bold",
    },
    value: {
        fontSize: 14,
        marginLeft: 8,
    },
});
