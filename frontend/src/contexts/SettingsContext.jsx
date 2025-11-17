import React, { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

const defaultSettings = {
  darkMode: false,
  language: "en",
  notifications: true,
  itemsPerPage: 10,
  dateFormat: "YYYY-MM-DD",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("app_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
    setIsLoaded(true);
  }, []);

  // Apply dark mode and language whenever settings change
  useEffect(() => {
    if (!isLoaded) return;

    // Apply dark mode
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply language
    document.documentElement.lang = settings.language || "en";

    // Save to localStorage
    try {
      localStorage.setItem("app_settings", JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  }, [settings, isLoaded]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
