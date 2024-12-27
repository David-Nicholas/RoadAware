import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Colors from "../constants/Colors";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

interface CardInfoProps {
  title: string;
  value: string;
}

export default function CardSpeeds({
  title,
  value,
}: CardInfoProps) {
  const { theme } = useContext(ThemeContext);
  const themeColors = Colors[theme];

  // Map speed values to corresponding images
  const speedImages: Record<string, any> = {
    "10": require("../assets/signs/10-removebg-preview.png"),
    "20": require("../assets/signs/20-removebg-preview.png"),
    "30": require("../assets/signs/30-removebg-preview.png"),
    "40": require("../assets/signs/40-removebg-preview.png"),
    "50": require("../assets/signs/50-removebg-preview.png"),
    "60": require("../assets/signs/60-removebg-preview.png"),
    "70": require("../assets/signs/70-removebg-preview.png"),
    "80": require("../assets/signs/80-removebg-preview.png"),
    "90": require("../assets/signs/90-removebg-preview.png"),
    "100": require("../assets/signs/100-removebg-preview.png"),
    "110": require("../assets/signs/110-removebg-preview.png"),
    "120": require("../assets/signs/120-removebg-preview.png"),
    "130": require("../assets/signs/130-removebg-preview.png"),
    "140": require("../assets/signs/140-removebg-preview.png"),
    "150": require("../assets/signs/150-removebg-preview.png"),
  };

  return (
    <View
      style={[
        styles.card,
        { borderColor: themeColors.primary, backgroundColor: themeColors.background },
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
      </View>
      {value in speedImages ? (
        <Image
          source={speedImages[value]}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <Text style={[styles.title, { color: themeColors.text }]}>No image</Text>
      )}
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
  image: {
    width: 50,
    height: 50,
  },
});
