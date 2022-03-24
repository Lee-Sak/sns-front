const initialState = {
  loginLoading: false,
  loginError: false,
  loginDone: false,

  follower: [],
  following: [],
  followerId: [],
  followingId: [],
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case "FOLLOWER_NICK":
      return {
        ...state,
        followerNick: [...action.data],
      };

    case "FOLLOWING_NICK":
      return {
        ...state,
        followingNick: [...action.data],
      };

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
        id: action.data,
        nick: action.nick,
        isLoggedIn: true,
      };
    case "DEL_USER_INFO":
      return {
        ...initialState,
      };
    case "FOLLOW":
      return {
        ...state,
        follower: [...action.data.followerIds],
        following: [...action.data.followingIds],
        followerId: [...action.data.a],
        followingId: [...action.data.b],
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
