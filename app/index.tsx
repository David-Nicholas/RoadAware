import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Colors from "../constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocation } from "../context/LocationContext";

export default function Index() {
  const { theme } = useContext(ThemeContext);
  const themeColors = Colors[theme];
  const router = useRouter();
  const { country, error } = useLocation();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Settings Icon */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => router.push("/settings")}
      >
        <Feather name="settings" size={24} color={themeColors.text} />
      </TouchableOpacity>

      {!!error ? (
        <Text style={{ color: themeColors.text }}>
          Something went wrong
        </Text>
      ) : (
        <Text style={{ color: themeColors.text }}>
          Current Country: {country || "Loading..."}
        </Text>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    top: 50,
    right: 20,
  },
});
