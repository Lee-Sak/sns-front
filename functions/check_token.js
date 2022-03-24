import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import axios from "axios";

const refreshToken = async (id) => {
  const res = await axios.get(`http://${process.env.BACK_IP}/user/token/${id}`);
  if (res.data.status === "success") {
    const token = res.data.data.token;
    return token;
  }
};

export const checkTokenStatus = async () => {
  const token = window.localStorage.getItem("token");

  if (token) {
    try {
      const { exp, id, nick } = jwt_decode(token);

      // token이 만료 돼었을 때
      if (Date.now() >= exp * 1000) {
        window.localStorage.removeItem("token");
        alert("세션이 만료되었습니다.");
        if (confirm("연장하시겠어요?")) {
          const refreshTok = await refreshToken(id);
          window.localStorage.setItem("token", refreshTok);

          return true;
        } else {
          return false;
        }
        // token이 만료돼지 않았을 때
      } else {
        return true;
      }
    } catch (e) {
      console.log("test error:", e);
    }
  } else {
    console.log("token이 존재하지 않습니다");
    return false;
  }
};

// 로그인이 필요한 페이지
export const checkLogin = async (token, currentUrl, dispatch, router) => {
  // const token = window.localStorage.getItem("token");
  if (token) {
    try {
      const { exp, id, nick } = jwt_decode(token);
      console.log("logined User Id:", id);
      // 세션이 만료 됐을 때 isLoggedIn: False, token 제거
      if (Date.now() >= exp * 1000) {
        window.localStorage.removeItem("token");

        alert("세션이 만료되었습니다.");
        if (confirm("연장하시겠어요?")) {
          const refreshTok = await refreshToken(id);
          console.log(refreshTok);
          window.localStorage.setItem("token", refreshTok);
          console.log("연장!");
          return true;
        } else {
          dispatch({
            type: "LOGOUT",
          });
          // router.push(`/signIn/?returnUrl=${currentUrl}`);
          return false;
        }

        // 세션이 살아 있을 때 true를 줌으로써 해당 페이지에서 계속 작업이 가능하게끔
      } else {
        return true;
      }
    } catch (e) {
      console.log("check_toekn", e.message);
      window.localStorage.removeItem("token");
    }
    // 토큰이 없을 때
  } else {
    alert("세션이 만료되었습니다.");
    router.push(`/signIn/?returnUrl=${currentUrl}`);
  }
};

// 로그인이 필요 없어도 되는 페이지
export const checkLogin2 = (dispatch) => {
  const token = window.localStorage.getItem("token");
  if (token) {
    try {
      const { exp, id, nick } = jwt_decode(token);
      if (Date.now() >= exp * 1000) {
        window.localStorage.removeItem("token");
        dispatch({
          type: "LOGOUT",
        });
        return false;
      } else {
        return true;
      }
    } catch (e) {
      console.log(e.message);
      window.localStorage.removeItem("token");
    }
  } else {
    return false;
  }
};

export const getFollower = async (dispatch, router, currentUrl) => {
  console.log("getFollower()");
  const token = window.localStorage.getItem("token");

  try {
    const res = await axios.get(`http://${process.env.BACK_IP}/user/follower`, {
      headers: {
        Authorization: token,
      },
    });

    let followerIds = [],
      followingIds = [];

    let a = [],
      b = [];

    if (res.data.data) {
      followerIds = res.data.data.followers.map((e) => {
        return { id: e.id, nick: e.nickname };
      });
      a = res.data.data.followers.map((e) => {
        return e.id;
      });
    }

    const res_1 = await axios.get(
      `http://${process.env.BACK_IP}/user/following`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (res_1.data.data) {
      followingIds = res_1.data.data.followings.map((e) => {
        return { id: e.id, nick: e.nickname };
      });
      b = res_1.data.data.followings.map((e) => {
        return e.id;
      });
    }

    dispatch({
      type: "FOLLOW",
      data: { followerIds, followingIds, a, b },
    });
  } catch (e) {
    if (e.response) {
      if (e.response.status === 401) {
        const isLogged = await checkTokenStatus();
        if (isLogged) {
          getFollower(dispatch, router, currentUrl);
        } else {
          router.push(`/signIn/?returnUrl=${currentUrl}`);
        }
      }
    }
  }
};
