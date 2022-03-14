import { useEffect, useState } from "react";

// 함수형 컴포넌트 안에 없어도, 다른 함수에서 이벤트를 처리 할 수 있음 -> 곧, 다른 파일과 분리가 가능
const useInput = (initialValue, validator) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    const targetValue = e.target.value;
    let willUpdate = true;
    if (typeof validator === "function") {
      willUpdate = validator(targetValue);
    }
    if (willUpdate) setValue(targetValue);
  };
  return { value, onChange };
};

const Hooks = () => {
  const maxLen = (value) => value.length < 10;
  const name = useInput("Mr.", maxLen); // useState와 onChange를 묶어놓은 함수, 리턴:{value=Mr., onChange=onChange}
  return (
    <div>
      <h1>Hello</h1>
      <input placeholder="Name" {...name} />
    </div>
  );
};
// 첫 렌더링
// useInput return -> name = {value='Mr.', onChange=onChange}
// <input placeholder='Name' value='Mr.', onChange=onChange />

// input text의 키보드 입력 발생시, 예를 들면 'a'
// onChange 함수가 발동. 기존 문자열에서 하나의 문자를 더한 값을 target.value에서 가져옴
// 유효성 검사 이후 input value를 setValue를 통해 변화가 되면 리렌더링 발생

// 이후 렌더링
// useInput 에서 usetState는 실행되지 않음
// 벨류 값은 setValue에 의해 설정된 벨류 값을 리턴
// return -> name = {value='Mr.a', onChange=onChange}
// <input placeholder='Name' value='Mr.a', onChange=onChange />
export default Hooks;
export { useInput };
