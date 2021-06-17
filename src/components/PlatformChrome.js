import React from "react";

import { PlatformCard } from "./CardTemplate";

const NAME = "Chrome";

const PlatformChrome = () => {
  const onClick = () => {
    alert("open new page or something");
  };

  return (
    <PlatformCard name={NAME} subname={"Browsing history"} icon={"chrome"} onClick={onClick} />
  );
};

export default PlatformChrome;
