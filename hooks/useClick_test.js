import { useEffect, useRef, useState } from "react";
let render = 0;

const App = () => {
  const onClick = () => {
    console.log("hihiaaaa");
  };

  // 즉시 실행 함수

  if (render === 0) {
    console.log("prerender");
    render++;
  } else console.log("render");

  const refTitle = useRef();

  useEffect(() => {
    const titleElement = refTitle.current;
    console.log(titleElement);
    if (titleElement) {
      titleElement.addEventListener("click", onClick);
    } else {
      console.log("not setting titleElement");
    }
    // 제거가 되기전 실행
    return () => {
      if (titleElement) {
        console.log("delete title element");
        titleElement.removeEventListener("click", onClick);
      }
    };
  }, []);

  return (
    <div>
      <h1 ref={refTitle}>i'm title</h1>
    </div>
  );
};

export default App;

// 일
