import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import Colors from "../constants/Colors";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

interface CardInfoProps {
  title: string;
  description: string;
  value: string;
}

export default function CardTolls({ title, description,  value }: CardInfoProps) {
  const { theme } = useContext(ThemeContext);
  const themeColors = Colors[theme];

  const handlePress = () => {
    Linking.openURL(value).catch((err) => console.error("Error opening URL", err));
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <View
        style={[
          styles.cardContent,
          { borderColor: themeColors.primary, backgroundColor: themeColors.background },
        ]}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
          <Text style={[styles.description, { color: themeColors.text }]}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
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
    fontWeight: "normal",
  },
});
