import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DetectionMode = "off" | "on";

interface DetectionContextType {
    detection: DetectionMode;
    toggleDetection: () => void;
}

export const DetectionContext = createContext<DetectionContextType>({
    detection: "off",
    toggleDetection: () => {},
});

export const DetectionProvider = ({ children }: { children: ReactNode }) => {
    const [detection, setDetection] = useState<DetectionMode>("off");

    useEffect(() => {
        const loadDetectionMode = async () => {
            try {
                const savedDetection = await AsyncStorage.getItem("detectionMode");
                if (savedDetection) {
                    setDetection(savedDetection as DetectionMode);
                }
            } catch (error) {
                console.error("Error loading detection mode:", error);
            }
        };
        loadDetectionMode();
    }, []);

    const toggleDetection = async () => {
        try {
            const newDetectionMode = detection === "off" ? "on" : "off";
            setDetection(newDetectionMode);
            await AsyncStorage.setItem("detectionMode", newDetectionMode);
        } catch (error) {
            console.error("Error toggling detection mode:", error);
        }
    };

    return (
        <DetectionContext.Provider value={{ detection, toggleDetection }}>
            {children}
        </DetectionContext.Provider>
    );
};
