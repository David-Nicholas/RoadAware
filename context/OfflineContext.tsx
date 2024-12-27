import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OfflineMode = "off" | "on";

interface OfflineContextType {
    offline: OfflineMode;
    toggleOffline: () => void;
}

export const OfflineContext = createContext<OfflineContextType>({
    offline: "off", // Default value
    toggleOffline: () => {},
});

export const OfflineProvider = ({ children }: { children: ReactNode }) => {
    const [offline, setOffline] = useState<OfflineMode>("off");

    useEffect(() => {
        const loadOfflineMode = async () => {
            try {
                const savedOffline = await AsyncStorage.getItem("offlineMode");
                if (savedOffline) {
                    setOffline(savedOffline as OfflineMode);
                }
            } catch (error) {
                console.error("Error loading offline mode:", error);
            }
        };
        loadOfflineMode();
    }, []);

    const toggleOffline = async () => {
        try {
            const newOfflineMode = offline === "off" ? "on" : "off";
            setOffline(newOfflineMode); // Update state
            await AsyncStorage.setItem("offlineMode", newOfflineMode); // Persist state
        } catch (error) {
            console.error("Error toggling offline mode:", error);
        }
    };

    return (
        <OfflineContext.Provider value={{ offline, toggleOffline }}>
            {children}
        </OfflineContext.Provider>
    );
};
