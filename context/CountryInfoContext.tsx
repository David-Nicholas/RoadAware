import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation } from "./LocationContext";

const apiUrl = process.env.EXPO_PUBLIC_API_COUNTRY_INFO;

interface CountryInfo {
    name: string;
    currency: string;
    contacts: {
        police: string;
        ambulance: string;
        assistace: string;
        firebrigade: string;
    };
    laws: {
        [key: string]: string | { [key: string]: string };
    };
    speeds: {
        "Country Road": string;
        "In Cities": string;
        "Expressway": string;
        "Highway": string;
    };
    tolls: string;
}

interface CountryInfoContextValue {
    data: CountryInfo | null;
    error: string | null;
    loading: boolean;
}

const CountryInfoContext = createContext<CountryInfoContextValue | undefined>(
    undefined
);

export const CountryInfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<CountryInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { country } = useLocation(); 

    useEffect(() => {
        if (!country) return; 

        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/country?name=${country}`);
                if (!response.ok) {
                    throw new Error(`Error fetching country info: ${response.statusText}`);
                  }
                const result = await response.json();

                
                console.log("API Response:", result);

                
                const parsedData: CountryInfo = {
                    name: result.name,
                    currency: result.currency,
                    tolls: result.tolls,
                    contacts: result.contacts,
                    laws: result.laws,
                    speeds: result.speeds,
                };

                setData(parsedData);
            } catch (err) {
                setError("Failed to fetch country information.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [country]);

    return (
        <CountryInfoContext.Provider value={{ data, error, loading }}>
            {children}
        </CountryInfoContext.Provider>
    );
};

export const useCountryInfo = (): CountryInfoContextValue => {
    const context = useContext(CountryInfoContext);
    if (!context) {
        throw new Error("useCountryInfo must be used within a CountryInfoProvider.");
    }
    return context;
};
