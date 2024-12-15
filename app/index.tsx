import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CardInfo from "@/components/CardInfo";
import CardTolls from "@/components/CardTolls";
import { ThemeContext } from "../context/ThemeContext";
import Colors from "../constants/Colors";
import { useLocation } from "../context/LocationContext";
import { useCountryInfo } from "../context/CountryInfoContext"; // Import your CountryInfoContext

export default function Index() {
  const { theme } = useContext(ThemeContext);
  const themeColors = Colors[theme];
  const router = useRouter();
  const { country, error } = useLocation();
  const { data, loading } = useCountryInfo(); // Use the countryInfo from the context
  const insets = useSafeAreaInsets();
  const [tollsUrl, setTollsUrl] = useState<any>(null);

  useEffect(() => {
    if (data && data.tolls) {
      setTollsUrl(data.tolls); // Set the tolls URL from the API response
    }
  }, [data]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themeColors.background, paddingTop: insets.top },
        ]}
      >
        <Text style={{ color: themeColors.text }}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: themeColors.background, paddingTop: insets.top },
        ]}
      >
        <Text style={{ color: themeColors.text }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeColors.background, paddingTop: insets.top },
      ]}
    >
      <TouchableOpacity
        style={[styles.iconContainer, { top: insets.top + 16 }]}
        onPress={() => router.push("/settings")}
      >
        <Feather name="settings" size={24} color={themeColors.text} />
      </TouchableOpacity>

      <View style={[styles.textContainer, { top: insets.top + 16 }]}>
        {!!error ? (
          <Text style={{ color: themeColors.text, fontSize: 16, fontWeight: "bold" }}>
            Something went wrong
          </Text>
        ) : (
          <Text style={{ color: themeColors.text, fontSize: 16, fontWeight: "bold" }}>
            Current Country: {country || "Loading..."}
          </Text>
        )}
      </View>

      <View style={[styles.cardsContainer]}>
        <CardInfo
          title="Speeds"
          description="Limits across the country, including urban roads, country roads, expressways, and highways."
          onPress={() => router.push("/speeds")}
        />

        <CardInfo
          title="Contacts"
          description="Essential SOS and roadside assistance numbers, including police, ambulance, fire services, and towing services, to ensure help is readily available during emergencies."
          onPress={() => router.push("/contacts")}
        />

        <CardInfo
          title="Laws"
          description="Key information on the country's driving regulations, such as seatbelt rules, alcohol limits, and required documents, ensuring safe and lawful driving."
          onPress={() => router.push("/laws")}
        />

        <CardInfo
          title="Convertor"
          description="Quick and easy tool to convert currencies, providing real-time exchange rates to assist with travel budgeting and transactions."
          onPress={() => router.push("/convertor")}
        />

        {tollsUrl && (
          <CardTolls
            title="Tolls"
            description="Website where you can find informations about the tolls in this country"
            value={tollsUrl} 
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  iconContainer: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  textContainer: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 60,
    width: "100%",
  },
});
