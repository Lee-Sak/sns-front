// 윈도우를 닫았을 때 아직저장하지 않았어! 라고 말하는 것
const usePreventLeave = (onLeaving) => {
  const listener = (event) => {
    event.preventDefault(); // 새로고침막고
    event.returnValue = ""; // 크롬은 리턴벨류를 요구
  };

  let enablePrevent, disablePrevent;
  if (typeof window !== "undefined") {
    enablePrevent = () => {
      window.addEventListener("beforeunload", listener);
    };
    disablePrevent = () => {
      window.removeEventListener("beforeunload", listener);
    };
  }

  return { enablePrevent, disablePrevent };
};
const App = () => {
  const { enablePrevent, disablePrevent } = usePreventLeave();

  return (
    <>
      <button onClick={enablePrevent}>Protect</button>
      <button onClick={disablePrevent}>UnProtect</button>
    </>
  );
};

export default App;
