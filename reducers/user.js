const initialState = {
  loginLoading: false,
  loginError: false,
  loginDone: false,
  isLoggedIn: false,
  id: "",
  nick: "",
  follower: [],
  following: [],
  email: "",
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN_REQUEST":
      return {
        ...state,
        loginLoading: true,
        loginDone: false,
      };
    case "LOG_IN_DONE":
      return {
        ...state,
        loginLoading: false,
        loginDone: true,
        isLoggedIn: true,
      };
    case "LOG_IN_ERROR":
      return {
        ...state,
        loginError: true,
        loginLoading: false,
      };
    case "CH_NICK":
      return {
        ...state,
        nick: action.data,
      };

    case "SET_USER_INFO":
      return {
        ...state,
        id: action.data.id,
        nick: action.data.nickname,
        isLoggedIn: true,
      };
    case "LOGOUT":
      return {
        ...state,
        id: "",
        nick: "",
        isLoggedIn: false,
      };
    case "follower":
      return {
        ...state,
        follower: [...action.data],
      };
    case "following":
      return {
        ...state,
        following: [...action.data],
      };
    case "GET_MYINFO":
      return {
        ...state,
        email: action.data,
      };
    default:
      return state;
  }
};

export { user };
