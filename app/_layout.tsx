import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { LocationProvider } from "../context/LocationContext"; // Import the LocationProvider

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LocationProvider> {/* Wrap the stack with the LocationProvider */}
        <Stack screenOptions={{ headerShown: false }} />
      </LocationProvider>
    </ThemeProvider>
  );
}
