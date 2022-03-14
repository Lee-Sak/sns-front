import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { post } from "./post";
import { user } from "./user";
// nextjs에서 생성한 redux store와 clinet에서 생성한 redux store 를 합치기 위한
// reducer가 결합되어 있는 그룹
export const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combineReducer = combineReducers({
        post,
        user,
      });
      return combineReducer(state, action);
    }
  }
};
// reducer는함수고 data를 modify 하기 위한 업데이터
