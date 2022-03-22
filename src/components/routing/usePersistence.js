import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const usePersistance = () => {
  const persistent = useSelector((state) => state.persistent);
  const { t } = useTranslation();

  useEffect(() => {
    // Welcome catches if IDB can be used. If not, we use fake-indexeddb as a fallback, which acts like idb, but in memory.
    // persistent is then set to false, which adds this event listener to give a warning to the user that if they leave/refresh
    // their session is lost.
    if (persistent) return;
    window.addEventListener("beforeunload", (e) => handleBeforeUnload(e, t));
    return () => {
      window.removeEventListener("beforeunload", (e) => handleBeforeUnload(e, t));
    };
  }, [persistent, t]);

  return null;
};

const handleBeforeUnload = (e, t) => {
  e.preventDefault();
  const message = t("routing.leavemessage");
  e.returnValue = message;
  return message;
};

export default usePersistance;
