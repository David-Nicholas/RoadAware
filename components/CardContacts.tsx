import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native"; // Import Linking directly
import Colors from "../constants/Colors";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

interface CardInfoProps {
  title: string;
  value: string; 
}

export default function CardContacts({
  title,
  value,
}: CardInfoProps) {
  const { theme } = useContext(ThemeContext);
  const themeColors = Colors[theme];
  const textColor = themeColors.text;
  const backgroundColor = themeColors.background;

  
  const handleCallPress = () => {
    const url = `tel:${value}`;
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open phone app:", err);
    });
  };

  return (
    <View
      style={[
        styles.card,
        { borderColor: themeColors.primary, backgroundColor: themeColors.background },
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <Text style={[styles.description, { color: textColor }]}>{value}</Text>
      </View>
      <TouchableOpacity
        style={[styles.callButton, { backgroundColor: backgroundColor }]}
        onPress={handleCallPress}
      >
        <Text style={[styles.callButtonText, { color: textColor }]}>
          Call
        </Text>
      </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: "normal",
  },
  callButton: {
    alignSelf: "stretch",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
