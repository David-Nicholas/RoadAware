import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { LocationProvider } from "../context/LocationContext"; 
import { CountryInfoProvider } from "../context/CountryInfoContext"; 

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <CountryInfoProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </CountryInfoProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}
