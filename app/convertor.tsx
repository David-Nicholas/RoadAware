import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ThemeContext } from "../context/ThemeContext";
import Colors from "../constants/Colors";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCountryInfo } from "../context/CountryInfoContext";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";


const API_CURRENCY = process.env.EXPO_PUBLIC_API_CURRENCY_RATES;
const API_KEY = process.env.EXPO_PUBLIC_API_CURRENCY_KEY;

export default function Convertor() {
    const { theme } = useContext(ThemeContext);
    const themeColors = Colors[theme];
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, loading, error } = useCountryInfo();

    const [baseCurrency, setBaseCurrency] = useState<string | null>(null);
    const [conversionRates, setConversionRates] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<{ label: string; value: string }[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
    const [input1, setInput1] = useState<string>("");
    const [input2, setInput2] = useState<string>("");
    const [isInput1Focused, setIsInput1Focused] = useState<boolean>(true);
    const [offline, setOffline] = useState<boolean>(false);

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
            const checkOfflineStatus = async () => {
                const isOffline = !(await navigator.onLine);
                setOffline(isOffline);
            };
    
            checkOfflineStatus();
        }, []);

    useEffect(() => {
        if (offline) {
            const loadOfflineData = async () => {
                const savedCountryInfo = await AsyncStorage.getItem("selectedCountryInfo");
                if (savedCountryInfo) {
                    const countryInfo = JSON.parse(savedCountryInfo);
                    if (countryInfo && countryInfo.currency) {
                        setBaseCurrency(countryInfo.currency);
                        setSelectedCurrency(countryInfo.currency);
                    }
                }
            };

            loadOfflineData();
        } else if (data && data.currency) {
            setBaseCurrency(data.currency);
        }
    }, [offline, data]);

    useEffect(() => {
        const fetchOrRetrieveConversionRates = async () => {
            if (!baseCurrency) return;

            try {
                if (offline) {
                    const storedRates = await AsyncStorage.getItem("currencyRates");

                    if (storedRates) {
                        const parsedRates = JSON.parse(storedRates);
                        setConversionRates(parsedRates);
                        setItems(
                            Object.keys(parsedRates).map((key) => ({
                                label: key,
                                value: key,
                            }))
                        );
                        setSelectedCurrency(Object.keys(parsedRates)[0]);
                        console.log("Loaded rates from storage:", parsedRates);
                    }
                    return;
                }

                const storedLastFetchedCurrency = await AsyncStorage.getItem("lastFetchedCurrency");

                if (storedLastFetchedCurrency === baseCurrency) {
                    const storedRates = await AsyncStorage.getItem(`conversionRates_${baseCurrency}`);
                    if (storedRates) {
                        const parsedRates = JSON.parse(storedRates);
                        setConversionRates(parsedRates);
                        setItems(
                            Object.keys(parsedRates).map((key) => ({
                                label: key,
                                value: key,
                            }))
                        );
                        setSelectedCurrency(Object.keys(parsedRates)[0]);
                        console.log("Loaded rates from storage:", parsedRates);
                        return;
                    }
                }

                if (storedLastFetchedCurrency && storedLastFetchedCurrency !== baseCurrency) {
                    await AsyncStorage.removeItem(`conversionRates_${storedLastFetchedCurrency}`);
                    console.log(`Deleted old rates for ${storedLastFetchedCurrency}`);
                }

                const url = `${API_CURRENCY}?apiKey=${API_KEY}&base=${baseCurrency}&resolution=1m&amount=1&places=6&format=json`;
                const response = await fetch(url, { method: "GET" });
                const result = await response.json();

                if (result.success) {
                    setConversionRates(result.rates);
                    setItems(
                        Object.keys(result.rates).map((key) => ({
                            label: key,
                            value: key,
                        }))
                    );
                    setSelectedCurrency(Object.keys(result.rates)[0]);
                    console.log("Fetched new rates:", result.rates);

                    await AsyncStorage.setItem(
                        `conversionRates_${baseCurrency}`,
                        JSON.stringify(result.rates)
                    );
                    await AsyncStorage.setItem("lastFetchedCurrency", baseCurrency);
                } else {
                    console.error("Failed to fetch conversion rates.");
                }
            } catch (error) {
                console.error("Error fetching or loading currency rates:", error);
            }
        };

        fetchOrRetrieveConversionRates();
    }, [baseCurrency, offline]);

    useEffect(() => {
        if (!conversionRates || !selectedCurrency) return;

        const rate = conversionRates[selectedCurrency];
        if (!rate) return;

        if (isInput1Focused && input1) {
            setInput2((parseFloat(input1) * rate).toFixed(2));
        } else if (!isInput1Focused && input2) {
            setInput1((parseFloat(input2) / rate).toFixed(2));
        }
    }, [input1, input2, isInput1Focused, conversionRates, selectedCurrency]);

    if (loading) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: themeColors.background, paddingTop: insets.top },
                ]}
            >
                <ActivityIndicator size="large" color={themeColors.primary} />
                <Text style={{ color: themeColors.text, marginTop: 8 }}>Loading...</Text>
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
                onPress={() => router.push("/")}
            >
                <AntDesign name="closecircleo" size={24} color={themeColors.text} />
            </TouchableOpacity>

            <View style={styles.content}>
                <View
                    style={[
                        styles.card,
                        {
                            borderColor: themeColors.primary,
                            backgroundColor: themeColors.background,
                        },
                    ]}
                >
                    <Text style={[styles.currency, { color: themeColors.text }]}>
                        Base Currency: {baseCurrency}
                    </Text>
                </View>

                <TextInput
                    style={[styles.input, { color: themeColors.text, borderColor: themeColors.primary }]}
                    placeholder="Enter amount"
                    placeholderTextColor={themeColors.text + "80"}
                    keyboardType="numeric"
                    value={input1}
                    onChangeText={(value) => {
                        setInput1(value);
                        setIsInput1Focused(true);
                    }}
                />

                <DropDownPicker
                    open={open}
                    value={selectedCurrency}
                    items={items}
                    setOpen={setOpen}
                    setValue={setSelectedCurrency}
                    setItems={setItems}
                    style={[styles.dropdown, { backgroundColor: themeColors.background, borderColor: themeColors.primary }]}
                    dropDownContainerStyle={{ backgroundColor: themeColors.background, borderColor: themeColors.primary }}
                    selectedItemContainerStyle={{ backgroundColor: themeColors.secondary }}
                    ArrowDownIconComponent={CustomArrowDownIcon}
                    ArrowUpIconComponent={CustomArrowUpIcon}
                    TickIconComponent={CustomTickIcon}
                    textStyle={{ color: themeColors.text }}
                    placeholder="Select a currency"
                />

                <TextInput
                    style={[styles.input, { color: themeColors.text, borderColor: themeColors.primary }]}
                    placeholder="Converted amount"
                    placeholderTextColor={themeColors.text + "80"}
                    keyboardType="numeric"
                    value={input2}
                    onChangeText={(value) => {
                        setInput2(value);
                        setIsInput1Focused(false);
                    }}
                />
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
    card: {
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
    },
    currency: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        marginVertical: 8,
    },
    dropdown: {
        marginVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 8,
    },
    content: {
        flex: 1,
        justifyContent: "flex-start",
        marginTop: 60,
    },
});

