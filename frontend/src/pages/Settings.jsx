import React, { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useTranslation } from "@/lib/translations";

export default function Settings() {
  const [message, setMessage] = useState("");
  const { settings, updateSetting, resetSettings } = useSettings();
  const t = useTranslation(settings.language);

  const handleToggle = (field) => {
    updateSetting(field, !settings[field]);
    setMessage(t("settingsSaved"));
    setTimeout(() => setMessage(""), 2000);
  };

  const handleChange = (field, value) => {
    updateSetting(field, value);
    setMessage(t("settingsSaved"));
    setTimeout(() => setMessage(""), 2000);
  };

  const handleReset = () => {
    resetSettings();
    setMessage(t("settingsReset"));
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <div className={`p-4 max-w-3xl mx-auto ${settings.darkMode ? "dark" : ""}`}>
      <h1 className="text-2xl font-semibold mb-4 dark:text-white">{t("settingsTitle")}</h1>

      <div className="space-y-6">
        <div className="flex items-center justify-between border rounded p-3 dark:border-gray-700 dark:bg-gray-800">
          <div>
            <div className="font-medium dark:text-white">{t("darkMode")}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t("darkModeDesc")}</div>
          </div>
          <div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => handleToggle("darkMode")}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="border rounded p-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="font-medium dark:text-white">{t("language")}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t("languageDesc")}</div>
          <select
            value={settings.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="en">English</option>
            <option value="si">සිංහල (Sinhala)</option>
            <option value="ta">தமிழ் (Tamil)</option>
          </select>
        </div>

        <div className="flex items-center justify-between border rounded p-3 dark:border-gray-700 dark:bg-gray-800">
          <div>
            <div className="font-medium dark:text-white">{t("notificationsLabel")}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t("notificationsDesc")}</div>
          </div>
          <div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => handleToggle("notifications")}
            />
          </div>
        </div>

        <div className="border rounded p-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="font-medium dark:text-white">{t("itemsPerPage")}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t("itemsPerPageDesc")}</div>
          <select
            value={settings.itemsPerPage}
            onChange={(e) => handleChange("itemsPerPage", Number(e.target.value))}
            className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="border rounded p-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="font-medium dark:text-white">{t("dateFormat")}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t("dateFormatDesc")}</div>
          <select
            value={settings.dateFormat}
            onChange={(e) => handleChange("dateFormat", e.target.value)}
            className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD (2025-11-17)</option>
            <option value="DD-MM-YYYY">DD-MM-YYYY (17-11-2025)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (11/17/2025)</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            {t("save")}
          </button>
          <button 
            onClick={handleReset} 
            className="border px-4 py-2 rounded dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t("reset")}
          </button>
        </div>

        {message && <div className="text-sm text-green-600 dark:text-green-400">{message}</div>}
      </div>

      {/* small inline CSS for simple toggle switch */}
      <style>{`
        .switch { position: relative; display: inline-block; width: 46px; height: 26px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 26px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: #4f46e5; }
        input:checked + .slider:before { transform: translateX(20px); }
      `}</style>
    </div>
  );
}
