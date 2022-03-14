import { useEffect, useState, useRef } from "react";

const useFullScreen = (callback) => {
  const element = useRef();
  const triggerFull = () => {
    if (element.current) {
      element.current.requestFullscreen();
      callback(true);
    }
  };
  const exitFull = () => {
    document.exitFullscreen();
    callback(false);
  };
  return { element, triggerFull, exitFull };
};

const App = () => {
  const onFullS = (isFull) => {
    console.log(isFull ? "we are full" : "we are small ");
  };
  const { element, triggerFull, exitFull } = useFullScreen(onFullS);

  return (
    <div style={{ height: "1000vh" }}>
      <div ref={element}>
        <img src="https://i.ibb.co/R6RwNxx/grape.jpg" alt="grape" width="250" />
        <button onClick={exitFull}>exit fullscreen </button>
      </div>

      <button onClick={triggerFull}>Make fullscreen</button>
    </div>
  );
};

export default App;
