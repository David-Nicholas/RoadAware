import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { ThemeContext } from "../context/ThemeContext";
import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCountryInfo } from "../context/CountryInfoContext"; 
import CardContacts from "../components/CardContacts";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

export default function Contacts() {
    const { theme } = useContext(ThemeContext);
    const themeColors = Colors[theme];
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, loading, error } = useCountryInfo(); 

    const [contactsData, setContactsData] = useState<any>(null);
    const [offline, setOffline] = useState<boolean>(false);

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
                    if (countryInfo && countryInfo.contacts) {
                        setContactsData(countryInfo.contacts);
                    }
                }
            };

            loadOfflineData();
        } else if (data && data.contacts) {
            setContactsData(data.contacts);
        }
    }, [offline, data]);

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
                onPress={() => router.push("/")}
            >
                <AntDesign name="closecircleo" size={24} color={themeColors.text} />
            </TouchableOpacity>

            <View style={styles.content}>
                {contactsData && Object.keys(contactsData).map((roadType) => (
                    <CardContacts
                        key={roadType}
                        title={roadType}
                        value={contactsData[roadType]}
                    />
                ))}
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
});
