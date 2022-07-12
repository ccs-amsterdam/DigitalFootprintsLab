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
  const label = languageOptions.find((o) => o.key === value)?.text;

  return (
    <Dropdown
      button
      className="icon"
      value={value}
      floating
      labeled
      icon="world"
      options={languageOptions}
      text={label}
      onChange={(e, d) => changeLanguageHandler(d.value)}
      style={{
        background: "#00000000",
        width: "10em",
        marginTop: "9px",
        color: "white",
        border: "1px solid white",
        ...style,
      }}
    />
  );
};

export default ChangeLanguage;
