import { useEffect, useState, memo } from "react";
import { useInput } from "./useInput";

const Button = ({ number, setNumber, text }) => {
  useEffect(() => {
    console.log(`${text} 컴포넌트가 화면에 나타남`);
    return () => {
      console.log(`${text} 컴포넌트가 화면에 사라짐`);
    };
  }, []);
  return (
    <>
      <div>{text}</div>
      <button onClick={() => setNumber((prev) => prev + 1)}>{number}</button>
    </>
  );
};

const DeleteButton = ({ setDeleted }) => {
  return (
    <>
      <button onClick={() => setDeleted(false)}>X</button>
    </>
  );
};

const MemorizedBtn = memo(Button);

const App = () => {
  const [number_0, setNumber_0] = useState(0);
  const [number_1, setNumber_1] = useState(0);
  const [deleted_0, setDeleted_0] = useState(true);
  const [deleted_1, setDeleted_1] = useState(true);

  const sayHello = () => console.log("hello");
  // componentDidMount(처음접속과 새로고침시 실행) + componentDidUpdate(리렌더링시 실행)
  //   useEffect(() => {
  //     sayHello();
  //   });

  // componentDidMount
  //   useEffect(() => {
  //     sayHello();
  //   }, []);

  // componentDidMount + (if number_0 is updated) componentDiuUpdate
  //   useEffect(() => {
  //     sayHello();
  //   }, [number_0]);

  // React.memo -> props가 바꼈는지 확인하고 바뀐것만 다시 그림
  return (
    <>
      <div>Hi</div>
      {deleted_0 && (
        <div>
          <MemorizedBtn
            number={number_0}
            setNumber={setNumber_0}
            text="button1"
          />
          <DeleteButton setDeleted={setDeleted_0} />
        </div>
      )}
      {deleted_1 && (
        <div>
          <MemorizedBtn
            number={number_1}
            setNumber={setNumber_1}
            text="button2"
          />
          <DeleteButton setDeleted={setDeleted_1} />
        </div>
      )}
    </>
  );
};

export default App;
