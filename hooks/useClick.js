import { useEffect, useRef, useState } from "react";
import { useInput } from "./useInput";
let render = 0;
const useClick = (onClick) => {
  if (typeof onClick !== "function") {
    return;
  }

  const refObject = useRef(); // prerender때만 실행됨
  // 프리렌더링이 완료되면 바로 실행됨
  useEffect(() => {
    const element = refObject.current;
    console.log(element);

    if (element) {
      element.addEventListener("click", onClick);
    } else {
      console.log("not setting element");
    }
    // 컴포넌트가 렌더링 되지 않고 사라지기 직전에 실행하는 코드
    return () => {
      if (element) {
        console.log("delete element");
        element.removeEventListener("click", onClick);
      }
    };
  }, []);
  return refObject;
};

const App = () => {
  // const [render, setRender] = useState(0);
  const onClick = () => {
    console.log("hihi");
  };

  const maxLen = (value) => value.length < 10;

  if (render === 0) {
    console.log("prerender");
    render++;
  } else console.log("rerender");

  const refTitle = useClick(onClick); // ref관련 데이터를 담고있는 오브젝트
  console.log("ref:", refTitle);

  const value = useInput("a", maxLen);

  return (
    <div>
      {value.value === "a" && <h1 ref={refTitle}>Hi</h1>}
      <input placeholder="Name" {...value} />
    </div>
  );
};

export default App;

// 프리렌더링으로 인해 ref=title이 세팅되고
// 새로고침렌더링으로
