import { useEffect, useState } from "react";

const Lowlands = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getData(setData);
  }, []);
  console.log(data);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* <div style={{backgroundImage: background ? `url(${background})` : "none", backgroundRepeat:'no-repeat',
        backgroundSize: `contain`, height:'100%', width:'100%'}}></div> */}
    </div>
  );
};

const getData = async (setData) => {
  try {
    const data = await fetch("http://localhost:5000/project/lowlands/publicdata");
    console.log(data);
    setData(data);
  } catch (e) {
    console.log(e);
  }
};

export default Lowlands;
