const initialState = {
  id: "",
  nick: "",
  isLoggedIn: false,
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
    default:
      return state;
  }
};

export { auth };
