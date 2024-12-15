import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

interface CardInfoProps {
  title: string;
  value: string;
}

export default function CardLaws({
  title,
  value,
}: CardInfoProps) {
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
          {value}
        </Text>
      </View>
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
