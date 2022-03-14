import { useEffect } from "react";
// document를 벗어날 때
const useBeforLeave = (onBefore) => {
  const handle = (event) => {
    console.log(event);
    const { clientY } = event;
    if (clientY <= 10) {
      onBefore();
    }
  };
  useEffect(() => {
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle);
  }, []);
};
const App = () => {
  const beforeLife = () => console.log("pls dont leave");
  useBeforLeave(beforeLife);
  return (
    <>
      <h1>hello</h1>
    </>
  );
};

export default App;
