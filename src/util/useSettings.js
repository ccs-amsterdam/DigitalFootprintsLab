import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import generalSettings from "project/generalSettings";

// return instruction
// return function to get a specific line of instruction
// which automatically falls back on default if it doesn't exist for a given language

/**
 * Returns the settings, but for all the values there is now an object with the keys 'value' and 'trans'
 * where trans is the translated value. THis way, the value kan be used to store results (e.g., answers to questions in the default language)
 * but the trans is shown to the user
 * @returns
 */
const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [, i18n] = useTranslation();

  useEffect(() => {
    if (!i18n) {
      setSettings({});
      return;
    }

    const language = i18n?.language.split("-")[0].toUpperCase();
    const settings = getSettings(generalSettings, language);
    setSettings(settings);
  }, [i18n]);

  return settings;
};

// this function copies the settings, but replacing all values with the {value, trans} object
const getSettings = (object, language) => {
  if (Array.isArray(object)) {
    const arr = [];
    for (let item of object) arr.push(getSettings(item, language));
    return arr;
  }

  if (typeof object !== "object") {
    // if we reached a value, then no translation are available (either just a single string is given, or value is not a string)
    return { value: object, trans: object };
  }

  if (typeof object === "object") {
    if (object.value) {
      // if we reached the value, we can pick the selected language and use value as default
      const trans = object[language] || object.value;
      return { value: object.value, trans };
    }

    const obj = {};
    for (let key of Object.keys(object)) {
      obj[key] = getSettings(object[key], language);
    }
    return obj;
  }
};

export default useSettings;
