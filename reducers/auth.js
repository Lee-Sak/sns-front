const initialState = {
  id: "",
  nick: "",
  isLoggedIn: false,
  email: "",
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case "SET_AUTH_INFO":
      return {
        isLoggedIn: true,
        id: action.data.id,
        nick: action.data.nick,
      };
    case "DEL_AUTH_INFO":
      return {
        ...initialState,
      };

    case "CH_NICK":
      return {
        ...state,
        nick: action.data,
      };
    case "CH_EMAIL":
      return {
        ...state,
        email: action.data,
      };

    default:
      return state;
  }
};

export { auth };
