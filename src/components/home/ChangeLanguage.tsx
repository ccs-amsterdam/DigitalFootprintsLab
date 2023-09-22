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
      icon={null}
      text={label.toUpperCase()}
      style={{
        color: "white",
        paddingLeft: "0",
        fontSize: "inherit",
        ...style,
      }}
    >
      <Dropdown.Menu style={{ transition: "all 1s linear", right: 0, left: -100 }}>
        {languageOptions.map((option) => {
          return (
            <Dropdown.Item
              key={option.key}
              value={option.value}
              onClick={() => changeLanguageHandler(option.value)}
            >
              {option.text}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChangeLanguage;
