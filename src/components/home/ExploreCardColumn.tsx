import React from "react";
import { useTranslation } from "react-i18next";
import ExploreCard from "./ExploreCard";

/**
 * Returns all explore cards to be rendered on the home page.
 */
const ExploreCardColumn = () => {
  const { t } = useTranslation();
  return (
    <>
      <Browsing t={t} />
      <Search t={t} />
      <Youtube t={t} />
    </>
  );
};

const Browsing = ({ t }) => {
  return (
    <ExploreCard
      name={"Browsing"}
      label={t("dataTypes.browsing.label")}
      subname={t("dataTypes.browsing.description")}
      icon={"history"}
    />
  );
};

const Search = ({ t }) => {
  return (
    <ExploreCard
      name={"Search"}
      label={t("dataTypes.search.label")}
      subname={t("dataTypes.search.description")}
      icon={"search"}
    />
  );
};

const Youtube = ({ t }) => {
  return (
    <ExploreCard
      name={"Youtube"}
      label={t("dataTypes.youtube.label")}
      subname={t("dataTypes.youtube.description")}
      icon={"youtube"}
    />
  );
};

export default ExploreCardColumn;
