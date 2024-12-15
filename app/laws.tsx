import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ThemeContext } from "../context/ThemeContext";
import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCountryInfo } from "../context/CountryInfoContext"; 
import CardLaws from "../components/CardLaws";
import CardNestedLaws from "../components/CardNestedLaws"; 

export default function Laws() {
    const { theme } = useContext(ThemeContext);
    const themeColors = Colors[theme];
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, loading, error } = useCountryInfo();

    const [lawsData, setLawsData] = useState<any>(null);

    useEffect(() => {
        if (data && data.laws) {
            setLawsData(data.laws);
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
                onPress={() => router.push("/")}
            >
                <AntDesign name="closecircleo" size={24} color={themeColors.text} />
            </TouchableOpacity>

            <View style={styles.content}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {lawsData &&
                        Object.keys(lawsData).map((lawKey) => {
                            const lawValue = lawsData[lawKey];
                            
                            if (typeof lawValue === "object") {
                                return (
                                    <CardNestedLaws
                                        key={lawKey}
                                        title={lawKey}
                                        values={lawValue} 
                                    />
                                );
                            }


                            return (
                                <CardLaws
                                    key={lawKey}
                                    title={lawKey}
                                    value={lawValue}
                                />
                            );
                        })}
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
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});
