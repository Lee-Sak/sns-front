import { useEffect, useState } from "react";

const useScroll = () => {
  const [state, setState] = useState({
    x: 0,
    y: 0,
  });

  const onScroll = (event) => {
    const [x, y] = [window.scrollX, window.scrollY];

    setState({ x, y });
  };
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
  }, []);
  return state;
};

const App = () => {
  const { y } = useScroll();
  return (
    <div style={{ height: "1000vh" }}>
      <h1 style={{ position: "fixed", color: y > 300 ? "red" : "blue" }}>Hi</h1>
    </div>
  );
};

export default App;
