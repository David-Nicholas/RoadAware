import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

interface CardSwitchProps {
  title: string;
  description: string;
  value: boolean; // Current value of the Switch
  onValueChange: (value: boolean) => void; // Function to handle Switch toggle
}

export default function CardSwitch({
  title,
  description,
  value,
  onValueChange,
}: CardSwitchProps) {
  const { theme } = useContext(ThemeContext);
  const themeColors = Colors[theme];

  return (
    <View
      style={[
        styles.card,
        { borderColor: themeColors.primary, backgroundColor: themeColors.background },
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
        <Text style={[styles.description, { color: themeColors.text }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={themeColors.text}
        trackColor={{
          false: themeColors.secondary,
          true: themeColors.secondary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
});
