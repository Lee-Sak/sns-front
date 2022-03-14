import { useEffect, useRef, useState } from "react";

const useNetwork = (onChange) => {
  if (typeof navigator !== "undefined") {
    const [status, setStatus] = useState(navigator.onLine); // 온라인여부 true,false
    const handleChange = () => {
      if (typeof onChange === "function") {
        onChange(navigator.onLine);
      }

      setStatus(navigator.onLine);
    };
    useEffect(() => {
      window.addEventListener("online", handleChange);
      window.addEventListener("offline", handleChange);
    });
    return status;
  } else {
    return true;
  }
};

const App = () => {
  const handleNetworkChange = (online) => {
    console.log(online ? "we just went online" : "we are offline");
  };
  const online = useNetwork(handleNetworkChange);

  return (
    <>
      <h1>{online ? "Online" : "Offline"}</h1>
    </>
  );
};

export default App;
