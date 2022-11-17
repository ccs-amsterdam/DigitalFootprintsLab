import { Dropdown } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

const languageOptions = [
  { key: "en", value: "en", text: "English" },
  { key: "nl", value: "nl", text: "Nederlands" },
  { key: "pl", value: "pl", text: "Polski" },
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
      value={value}
      icon={null}
      direction="left"
      options={languageOptions}
      onChange={(e, d) => changeLanguageHandler(d.value)}
      style={{
        color: "white",
        paddingLeft: "0",
        ...style,
      }}
    />
  );
};

export default ChangeLanguage;
