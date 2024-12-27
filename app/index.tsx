import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import CardInfo from "@/components/CardInfo";
import CardTolls from "@/components/CardTolls";
import { ThemeContext } from "../context/ThemeContext";
import { OfflineContext } from "../context/OfflineContext";
import Colors from "../constants/Colors";
import { useLocation } from "../context/LocationContext";
import { useCountryInfo } from "../context/CountryInfoContext";

export default function Index() {
  const CustomArrowDownIcon = ({ style }: { style: any }) => (
    <MaterialIcons name="keyboard-arrow-down" size={24} color={themeColors.primary} style={style} />
  );

  const CustomArrowUpIcon = ({ style }: { style: any }) => (
    <MaterialIcons name="keyboard-arrow-up" size={24} color={themeColors.primary} style={style} />
  );

  const CustomTickIcon = ({ style }: { style: any }) => (
    <FontAwesome name="check" size={20} color={themeColors.primary} style={style} />
  );

  const { theme } = useContext(ThemeContext);
  const { offline } = useContext(OfflineContext);
  const themeColors = Colors[theme];
  const router = useRouter();
  const { country, error } = useLocation();
  const { data, loading } = useCountryInfo();
  const insets = useSafeAreaInsets();

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [tollsUrl, setTollsUrl] = useState<any>(null);
  const [selectedCountriesList, setSelectedCountriesList] = useState<string[]>([]);
  const [selectedCountriesInfo, setSelectedCountriesInfo] = useState<any>({});
  const [dropDownOpen, setDropDownOpen] = useState(false);

  useEffect(() => {
    const loadAsyncStorageData = async () => {
      const countriesList = await AsyncStorage.getItem("selectedCountriesList");
      const countriesInfo = await AsyncStorage.getItem("selectedCountriesInformations");
      const savedCountry = await AsyncStorage.getItem("selectedCountry");
      const savedCountryInfo = await AsyncStorage.getItem("selectedCountryInfo");

      if (countriesList) setSelectedCountriesList(JSON.parse(countriesList));
      if (countriesInfo) setSelectedCountriesInfo(JSON.parse(countriesInfo));
      if (savedCountry) setSelectedCountry(savedCountry);
    };

    loadAsyncStorageData();
  }, []);

  useEffect(() => {
    if (offline && selectedCountry && selectedCountriesInfo.countries) {
      const countryInfo = selectedCountriesInfo.countries.find(
        (c: any) => c.name === selectedCountry
      );
      if (countryInfo) {
        setTollsUrl(countryInfo.tolls);
      }
    } else if (data && data.tolls) {
      setTollsUrl(data.tolls);
    }
  }, [data, offline, selectedCountry, selectedCountriesInfo]);

  useEffect(() => {
    if (offline === "off") {
      setSelectedCountry(null);
      setSelectedCountriesInfo({});
      AsyncStorage.removeItem("selectedCountry");
      AsyncStorage.removeItem("selectedCountryInfo");
    }
  }, [offline]);

  useEffect(() => {
    if (selectedCountry) {
      const countryInfo = selectedCountriesInfo.countries.find(
        (c: any) => c.name === selectedCountry
      );
      
      if (countryInfo) {
        AsyncStorage.setItem("selectedCountry", selectedCountry);
        AsyncStorage.setItem("selectedCountryInfo", JSON.stringify(countryInfo));

        console.log("Selected country", selectedCountry);
        console.log("Selected country info", countryInfo);
        console.log(selectedCountriesInfo);
      }
    }
  }, [selectedCountry, selectedCountriesInfo]);

  if (loading && !offline) {
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

  if (error && !offline) {
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

      {offline === "off" && (
        <View style={[styles.locationContainerOnline, { top: insets.top + 16 }]}>
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
      )}

      {offline === "on" && (
        <View style={[styles.locationContainerOffline, { top: insets.top + 4, flexDirection: "row", alignItems: "center" }]}>
          <DropDownPicker
            open={dropDownOpen}
            setOpen={setDropDownOpen}
            value={selectedCountry}
            setValue={setSelectedCountry}
            items={selectedCountriesList.map((country) => ({
              label: country,
              value: country,
            }))}
            placeholder="Saved countries"
            style={[
              styles.dropdown,
              { backgroundColor: themeColors.background, borderColor: themeColors.primary, flex: 1, width: 180 },
            ]}
            dropDownContainerStyle={{ backgroundColor: themeColors.background, borderColor: themeColors.primary, width: 180 }}
            selectedItemContainerStyle={{ backgroundColor: themeColors.secondary }}
            ArrowDownIconComponent={CustomArrowDownIcon}
            ArrowUpIconComponent={CustomArrowUpIcon}
            TickIconComponent={CustomTickIcon}
            textStyle={{ color: themeColors.primary }}
          />
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderColor: themeColors.text,
                backgroundColor: themeColors.background,
              },
            ]}
            onPress={() => {
              const countryInfo = selectedCountriesInfo.countries.find(
                (c: any) => c.name === selectedCountry
              );
              if (countryInfo) {
                setTollsUrl(countryInfo.tolls);
              }
            }}
          >
            <Text style={[styles.buttonText, { color: themeColors.text }]}>
              Load
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
        {(tollsUrl) && (offline === "off") && (
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
  locationContainerOnline: {
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
  locationContainerOffline: {
    position: "absolute",
    top: 60,
    left: 15,
    right: 190,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dropdown: {
    flex: 1,
    height: 30,
    borderRadius: 8,
  },
  button: {
    width: 80,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
