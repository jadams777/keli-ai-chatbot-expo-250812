import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ColorScheme = "light" | "dark";

export function useColorScheme() {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("light");

  useEffect(() => {
    const loadColorScheme = async () => {
      try {
        const savedScheme = await AsyncStorage.getItem("theme");
        if (savedScheme === "dark" || savedScheme === "light") {
          setColorSchemeState(savedScheme);
        }
      } catch (error) {
        console.error("Failed to load color scheme:", error);
      }
    };
    loadColorScheme();
  }, []);

  const setColorScheme = async (scheme: ColorScheme) => {
    try {
      await AsyncStorage.setItem("theme", scheme);
      setColorSchemeState(scheme);
    } catch (error) {
      console.error("Failed to save color scheme:", error);
    }
  };

  const toggleColorScheme = () => {
    const newScheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newScheme);
  };

  return {
    colorScheme,
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}
