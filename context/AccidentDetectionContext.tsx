import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { Accelerometer } from "expo-sensors";
import { Alert, Linking } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { DetectionContext } from "@/context/DetectionContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AccidentDetectionContextType {
  isDetectingAccident: boolean;
}

export const AccidentDetectionContext = createContext<AccidentDetectionContextType | undefined>(undefined);

const ACCIDENT_THRESHOLD = 20;

export const AccidentDetectionProvider = ({ children }: { children: ReactNode }) => {
  const [acceleration, setAcceleration] = useState<any>(null);
  const [isDetectingAccident, setIsDetectingAccident] = useState(false);
  const isFocused = useIsFocused();
  const { detection } = useContext(DetectionContext);
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState<string | null>(null);

  const handleEmergencyCall = async () => {
    try {
      const emergencyPhoneNumber = await AsyncStorage.getItem("EmergencyPhoneNumber");
      if (emergencyPhoneNumber) {
        console.log(`Calling emergency number: ${emergencyPhoneNumber}`);
        Linking.openURL(`tel:${emergencyPhoneNumber}`);
      } else {
        console.warn("Emergency phone number is not set.");
        Alert.alert("Error", "No emergency phone number found.");
      }
    } catch (error) {
      console.error("Failed to retrieve emergency phone number:", error);
      Alert.alert("Error", "Failed to retrieve emergency phone number.");
    }
  };

  useEffect(() => {
    // Only detect accidents if detection is "on"
    if (isFocused && detection === "on") {
      const subscription = Accelerometer.addListener((data) => {
        setAcceleration(data);
        const totalAcceleration = Math.sqrt(
          data.x * data.x + data.y * data.y + data.z * data.z
        );

        if (totalAcceleration > ACCIDENT_THRESHOLD) {
          setIsDetectingAccident(true);
          Alert.alert(
            "Accident Detected",
            "Have you been in an accident?",
            [
              {
                text: "No",
                onPress: () => {
                  setIsDetectingAccident(false);
                },
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => {
                  console.log("Calling emergency number...");
                  handleEmergencyCall();
                  setIsDetectingAccident(false);
                },
              },
            ],
            { cancelable: false }
          );
        }
      });

      Accelerometer.setUpdateInterval(100);

      return () => {
        subscription.remove();
      };
    } else {
      setIsDetectingAccident(false); 
    }
  }, [isFocused, detection, emergencyPhoneNumber]); 

  return (
    <AccidentDetectionContext.Provider value={{ isDetectingAccident }}>
      {children}
    </AccidentDetectionContext.Provider>
  );
};
