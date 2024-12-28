import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Button, TextInput, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CardSwitch from "../components/CardSwitch";
import { ThemeContext } from "../context/ThemeContext";
import Colors from "../constants/Colors";
import { OfflineContext } from "../context/OfflineContext";
import { DetectionContext } from "@/context/DetectionContext";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { countries } from "../constants/Countries";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_API_COUNTRY_INFO;
const API_CURRENCY = process.env.EXPO_PUBLIC_API_CURRENCY_RATES;
const API_KEY = process.env.EXPO_PUBLIC_API_CURRENCY_KEY;

export default function Settings() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { offline, toggleOffline } = useContext(OfflineContext);
    const { detection, toggleDetection } = useContext(DetectionContext);
    const themeColors = Colors[theme];
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState<string>("");
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [dropdownItems, setDropdownItems] = useState(
        countries.map((country) => ({ label: country, value: country }))
    );

    const CustomArrowDownIcon = ({ style }: { style: any }) => (
        <MaterialIcons name="keyboard-arrow-down" size={24} color={themeColors.primary} style={style} />
    );

    const CustomArrowUpIcon = ({ style }: { style: any }) => (
        <MaterialIcons name="keyboard-arrow-up" size={24} color={themeColors.primary} style={style} />
    );

    const CustomTickIcon = ({ style }: { style: any }) => (
        <FontAwesome name="check" size={20} color={themeColors.primary} style={style} />
    );

    useEffect(() => {
        const loadEmergencyPhoneNumber = async () => {
            const storedNumber = await AsyncStorage.getItem("EmergencyPhoneNumber");
            if (storedNumber) {
                setEmergencyPhoneNumber(JSON.parse(storedNumber));
            }
        };

        const loadSelectedCountries = async () => {
            const storedCountries = await AsyncStorage.getItem("selectedCountriesList");
            if (storedCountries) {
                setSelectedCountries(JSON.parse(storedCountries));
            }
        };

        loadEmergencyPhoneNumber();
        loadSelectedCountries();
    }, []);

    useEffect(() => {
        if (offline === "off") {
            setSelectedCountries([]);
            AsyncStorage.removeItem("selectedCountriesList");
            console.log("Delete select counties list");
            AsyncStorage.removeItem("selectedCountriesInformations");
            console.log("Delete select counties informations");
            AsyncStorage.removeItem("currencyRates");
            console.log("Delete currency rates");
        }
    }, [offline]);

    useEffect(() => {
        if (detection === "off") {
            setEmergencyPhoneNumber("");
            AsyncStorage.removeItem("EmergencyPhoneNumber");
            console.log("Delete emergency number from storage");
        }
    }, [detection]);

    const handleSaveCountries = async () => {
        try {
            await AsyncStorage.setItem("selectedCountriesList", JSON.stringify(selectedCountries));
            alert("Countries saved!");
            console.log("Selected countries:", selectedCountries);

            const countriesParam = encodeURIComponent(JSON.stringify(selectedCountries));
            const response = await fetch(`${API_URL}/countries?names=${countriesParam}`);
            if (!response.ok) {
                throw new Error(`Error fetching country info: ${response.statusText}`);
            }
            const countryInfo = await response.json();
            console.log("Fetched country information:", countryInfo);

            await AsyncStorage.setItem("selectedCountriesInformations", JSON.stringify(countryInfo, null));

            alert("Country information saved!");

            const url = `${API_CURRENCY}?apiKey=${API_KEY}&base=EUR&resolution=1m&amount=1&places=6&format=json`;
            const responseCurrency = await fetch(url, { method: "GET" });
            if (!responseCurrency.ok) {
                throw new Error(`Error fetching currency conversion rates: ${responseCurrency.statusText}`);
            }

            const currencyData = await responseCurrency.json();
            await AsyncStorage.setItem("currencyRates", JSON.stringify(currencyData.rates));
            alert("Currency rates saved!");
        } catch (error) {
            console.error("Failed to save countries, fetch country info, or fetch currency conversion rates:", error);
            alert("Failed to save countries, fetch information, or fetch currency rates.");
        }
    };

    const handleSaveNumber = async () => {
        try {
            await AsyncStorage.setItem("EmergencyPhoneNumber", JSON.stringify(emergencyPhoneNumber));
            alert("Emergency phone number saved!");
        } catch (error) {
            console.error("Failed to save emergency phone number in storage: ", error);
            alert("Failed to save emergency phone number in storage");
        }
    };


    return (
        <View
            style={[
                styles.container,
                { backgroundColor: themeColors.background, paddingTop: insets.top },
            ]}
        >
            <TouchableOpacity
                style={[styles.iconContainer, { top: insets.top + 16 }]}
                onPress={() => router.push("/")}
            >
                <AntDesign name="closecircleo" size={24} color={themeColors.text} />
            </TouchableOpacity>

            <View style={styles.content}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <CardSwitch
                        title="Theme"
                        description="Modify the theme to light or dark mode."
                        value={theme === "dark"}
                        onValueChange={toggleTheme}
                    />

                    <CardSwitch
                        title="Accident"
                        description="Enable accident detection to monitor for potential crashes."
                        value={detection === "on"}
                        onValueChange={toggleDetection}
                    />

                    <CardSwitch
                        title="Offline"
                        description="Enable offline mode to store country data."
                        value={offline === "on"}
                        onValueChange={toggleOffline}
                    />

                    <View style={[styles.lineSeparator]}>
                        <Text style={[{ color: themeColors.primary }]}>
                            _____________________________
                        </Text>
                    </View>

                    {detection === "on" && (
                        <View style={styles.inputRow}>
                            <TextInput
                                style={[
                                    styles.textInput,
                                    {
                                        borderColor: themeColors.primary,
                                        color: themeColors.text,
                                        backgroundColor: themeColors.background,
                                        flex: 1,
                                    },
                                ]}
                                placeholder="Enter emergency number"
                                placeholderTextColor={themeColors.text}
                                value={emergencyPhoneNumber}
                                onChangeText={setEmergencyPhoneNumber}
                                keyboardType="number-pad"
                            />
                            <TouchableOpacity
                                style={[
                                    styles.saveButton2,
                                    {
                                        borderColor: themeColors.primary,
                                        backgroundColor: themeColors.background,
                                        marginLeft: 8, 
                                    },
                                ]}
                                onPress={handleSaveNumber}
                            >
                                <Text
                                    style={[
                                        styles.saveButtonText2,
                                        { color: themeColors.primary },
                                    ]}
                                >
                                    Save
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {offline === "on" && (
                        <View>
                            <TouchableOpacity
                                style={[
                                    styles.saveButton,
                                    { borderColor: themeColors.primary, backgroundColor: themeColors.background },
                                ]}
                                onPress={handleSaveCountries}
                            >
                                <Text
                                    style={[
                                        styles.saveButtonText,
                                        { color: themeColors.primary },
                                    ]}
                                >
                                    Save Countries
                                </Text>
                            </TouchableOpacity>
                            <DropDownPicker
                                open={open}
                                setOpen={setOpen}
                                value={selectedCountries}
                                setValue={setSelectedCountries}
                                items={dropdownItems}
                                setItems={setDropdownItems}
                                multiple={true}
                                placeholder="Select countries"
                                style={[styles.dropdown, { backgroundColor: themeColors.background, borderColor: themeColors.primary }]}
                                dropDownContainerStyle={{ backgroundColor: themeColors.background, borderColor: themeColors.primary }}
                                selectedItemContainerStyle={{ backgroundColor: themeColors.secondary }}
                                ArrowDownIconComponent={CustomArrowDownIcon}
                                ArrowUpIconComponent={CustomArrowUpIcon}
                                TickIconComponent={CustomTickIcon}
                                textStyle={{ color: themeColors.primary }}
                            />
                        </View>
                    )}
                </ScrollView>
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
        right: 16,
    },
    content: {
        flex: 1,
        justifyContent: "flex-start",
        marginTop: 60,
    },
    dropdown: {
        marginTop: 16,
        marginVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 8,
    },
    saveButton: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    lineSeparator: {
        alignItems: "center"
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 12,
        fontSize: 16,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    inputRow: {
        flexDirection: "row", 
        alignItems: "center",
        marginTop: 16,
    },
    saveButton2: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    saveButtonText2: {
        fontSize: 16,
        fontWeight: "bold",
    },
});