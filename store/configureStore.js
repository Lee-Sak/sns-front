import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper } from "next-redux-wrapper";
import thunkMiddleware from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import { persistedReducer } from "../reducers/persist";
import { rootReducer } from "../reducers/root";
import logger from "redux-logger";

// const loggerMiddleware =
//   ({ dispatch, getState }) =>
//   (next) =>
//   (action) => {
//     console.log("-----------\n", action);
//     return next(action);
//   };
const makeConfiguredStore = (reducer) => {
  const middlewares = [thunkMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));
  return createStore(reducer, enhancer);
};
const makeStore = () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    return makeConfiguredStore(rootReducer);
  } else {
    // we need it only on client side
    const store = makeConfiguredStore(persistedReducer);
    let persistor = persistStore(store);
    return { persistor, ...store };
  }
};

// wrapper 로 감싸기
export const wrapper = createWrapper(makeStore, {
  debug: process.env.NODE_ENV !== "production",
});

// ------------------------------------------------------------ //

// const makeConfiguredStore = (reducer) => createStore(reducer, undefined, applyMiddleware(logger));

// 스토어를 만들면 reducer를 initial state로 불러옴
// store는 데이터를 저장하는 곳
// const configureStore = () => {
//   // thunk : 한 action에 dispatch 여러번 등, 비동기 처리에도 사용
//   const middlewares = [thunkMiddleware];

//   // 크롬 개발툴 연동
//   const enhancer =
//     process.env.NODE_ENV === "production"
//       ? compose(applyMiddleware(...middlewares))
//       : composeWithDevTools(applyMiddleware(...middlewares));

//   // 해당 그룹을 기반으로 저장소를 만들건데, 개발모드일시 크롬에서 개발툴을 제공할거임
//   const store = createStore(rootReducer, enhancer);
//   return store;
// };

// // next에게 sever와 clinet store가 합처졌다고 알리는 wrapper 생성
// // index가 server store라고 인식
// // 서버에서도 클라이언트 store를 사용가능하게 만들어줌
// // 어떠한 페이지에서 ssr이 있다고 하고
// // 이 wrapper로 해당 페이지를 감싸주게 되면
// // 그 페이지에 있는 ssr코드에서 clinet store에 접근할 수 있게되게끔 만들어줌
// const wrapper = createWrapper(configureStore, {
//   debug: process.env.NODE_ENV === "dev",
// });

// export default wrapper;
