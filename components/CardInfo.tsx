import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useRouter } from "expo-router";

interface CardInfoProps {
  title: string;
  description: string;
  onPress: () => void; 
}

export default function CardInfo({
  title,
  description,
  onPress,
}: CardInfoProps) {
  const { theme } = useContext(ThemeContext);
  const themeColors = Colors[theme];
  const router = useRouter(); 

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: themeColors.primary, backgroundColor: themeColors.background },
      ]}
      onPress={onPress} 
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
        <Text style={[styles.description, { color: themeColors.text }]}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
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
