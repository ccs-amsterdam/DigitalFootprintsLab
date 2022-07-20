import React from "react";
import { Dropdown } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

const languageOptions = [
  { key: "en", value: "en", text: "English" },
  { key: "nl", value: "nl", text: "Nederlands" },
];

const ChangeLanguage = ({ style = {} }) => {
  const { i18n } = useTranslation();

  const changeLanguageHandler = (lang) => {
    i18n.changeLanguage(lang);
  };

  const value = i18n.language.split("-")[0];
  const label = languageOptions.find((o) => o.key === value)?.value;

  return (
    <Dropdown
      item
      text={label.toUpperCase()}
      className="icon"
      value={value}
      floating
      labeled
      //icon="world"
      options={languageOptions}
      onChange={(e, d) => changeLanguageHandler(d.value)}
      style={{
        color: "white",
        ...style,
      }}
    />
  );
};

export default ChangeLanguage;
