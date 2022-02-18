import { useEffect } from "react";
import { useSelector } from "react-redux";

const usePersistance = () => {
  const persistent = useSelector((state) => state.persistent);

  useEffect(() => {
    // Welcome catches if IDB can be used. If not, we use fake-indexeddb as a fallback, which acts like idb, but in memory.
    // persistent is then set to false, which adds this event listener to give a warning to the user that if they leave/refresh
    // their session is lost.
    if (persistent) return;
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [persistent]);

  const handleBeforeUnload = (e) => {
    e.preventDefault();
    const message = "Are you sure you want to leave? All provided data will be lost.";
    e.returnValue = message;
    return message;
  };

  return null;
};

export default usePersistance;
