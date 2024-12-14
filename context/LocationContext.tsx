import React, { createContext, useState, useEffect, useContext } from "react";
import * as Location from "expo-location";

interface LocationContextValue {
  country: string | null;
  error: string | null;
}

const LocationContext = createContext<LocationContextValue | undefined>(
  undefined
);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [country, setCountry] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
  
    const startLocationUpdates = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied.");
          return;
        }
  
        // Start watching the location
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 }, // Adjust intervals as needed
          async (location) => {
            const { latitude, longitude } = location.coords;
  
            // Reverse geocode to get the country
            const response = await Location.reverseGeocodeAsync({
              latitude,
              longitude,
            });
  
            if (response && response.length > 0) {
              setCountry(response[0].country || "Unknown location");
            } else {
              setError("Unable to determine country.");
            }
          }
        );
      } catch (err) {
        setError("Error fetching location.");
      }
    };
  
    startLocationUpdates();
  
    // Cleanup function to stop watching the location
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);
  

  return (
    <LocationContext.Provider value={{ country, error }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextValue => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider.");
  }
  return context;
};