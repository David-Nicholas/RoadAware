import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { LocationProvider } from "../context/LocationContext";
import { CountryInfoProvider } from "../context/CountryInfoContext";
import { OfflineProvider } from "@/context/OfflineContext";
import { AccidentDetectionProvider } from "@/context/AccidentDetectionContext";
import { DetectionContext, DetectionProvider } from "@/context/DetectionContext";
import { useContext } from "react";


export default function RootLayout() {
  const { detection, toggleDetection } = useContext(DetectionContext);
  console.log(detection);
  return (
      <OfflineProvider>
        <ThemeProvider>
          <DetectionProvider>
          <LocationProvider>
            <CountryInfoProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <AccidentDetectionProvider children={undefined}></AccidentDetectionProvider>
            </CountryInfoProvider>
          </LocationProvider>
          </DetectionProvider>
        </ThemeProvider>
      </OfflineProvider>

  );
}
