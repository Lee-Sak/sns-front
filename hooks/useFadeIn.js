import { useEffect, useRef } from "react";

const useFadeIn = (duration = 3, delay = 0) => {
  const element = useRef();
  // 클라이언트에서 실행하는 코드, prerendering 이후
  useEffect(() => {
    if (element.current) {
      const { current } = element;
      current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`;
      current.style.opacity = 1; // 0:완전투명 ~ 1:완전불투명(선명한정도?)
    }
  }, []);
  return { ref: element, style: { opacity: 0 } };
};

const App = () => {
  const fadeInH1 = useFadeIn(1, 2);
  const fadInP = useFadeIn(5, 10);
  console.log(fadInP.style);
  return (
    <>
      <h1 {...fadeInH1}> Hello</h1>
      <p {...fadInP}>lorem ipsum lalalalalal</p>
    </>
  );
};

export default App;
