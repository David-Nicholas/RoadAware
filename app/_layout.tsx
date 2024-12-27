import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { LocationProvider } from "../context/LocationContext"; 
import { CountryInfoProvider } from "../context/CountryInfoContext"; 
import { OfflineProvider } from "@/context/OfflineContext";

export default function RootLayout() {
  return (
    <OfflineProvider>
    <ThemeProvider>
      <LocationProvider>
        <CountryInfoProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </CountryInfoProvider>
      </LocationProvider>
    </ThemeProvider>
    </OfflineProvider>
  );
}
