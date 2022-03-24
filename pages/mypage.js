import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { checkLogin, getFollower } from "../functions/check_token";
import { checkTokenStatus } from "../functions/check_token";

const MyPage = () => {
  const { id, isLoggedIn, nick } = useSelector((state) => state.auth);
  const router = useRouter();
  const currentUrl = router.asPath;
  const dispatch = useDispatch();

  const [pw, setPw] = useState("");
  const [nickCH, setnickCH] = useState("");
  const [emailCH, setemailCH] = useState("");

  const taskToken = async () => {
    console.log(currentUrl, "page's", "taskToken()");
    const isLogged = await checkTokenStatus();
    if (isLogged) {
      // 토큰값 재설정
      getMyInfo();
      getFollower(dispatch, router, currentUrl);
    } else {
      dispatch({ type: "DEL_AUTH_INFO" });
      router.push(`/signIn/?returnUrl=${currentUrl}`);
    }
  };

  useEffect(() => {
    taskToken();
  }, []);

  const getMyInfo = async () => {
    try {
      console.log("getMyInfo()");
      const token = window.localStorage.getItem("token");
      const res = await axios.get(`http://${process.env.BACK_IP}/user/` + id, {
        headers: {
          Authorization: token,
        },
      });
      const data = res.data.data.email;
      setnickCH(nick);
      setemailCH(data);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          const isLogged = await checkTokenStatus();
          if (isLogged) {
            getMyInfo();
          } else {
            dispatch({ type: "DEL_AUTH_INFO" });
            router.push(`/signIn/?returnUrl=${currentUrl}`);
          }
        }
      }
    }
  };

  const onChangeNick = (e) => {
    setnickCH(e.target.value);
  };
  const onChangePw = (e) => {
    setPw(e.target.value);
  };
  const onChangeEmail = (e) => {
    setemailCH(e.target.value);
  };

  const onClickEmailUpd = async () => {
    try {
      const res = await axios.put(
        `http://${process.env.BACK_IP}/user/` + id,
        {
          email: emailCH,
          nickname: nickCH,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.data.status === "success") alert("수정 성공");
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          const isLogged = await checkTokenStatus();
          if (isLogged) {
            getMyInfo();
          } else {
            dispatch({ type: "DEL_AUTH_INFO" });
            router.push(`/signIn/?returnUrl=${currentUrl}`);
          }
        }
      }
    }
  };

  const onClickNickUpd = async () => {
    try {
      const res = await axios.put(
        `http://${process.env.BACK_IP}/user/` + id,
        {
          nickname: nickCH,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.data.status === "success") {
        dispatch({ type: "CH_NICK", data: nickCH });
        alert("수정 성공");
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          const isLogged = await checkTokenStatus();
          if (isLogged) {
            getMyInfo();
          } else {
            dispatch({ type: "DEL_AUTH_INFO" });
            router.push(`/signIn/?returnUrl=${currentUrl}`);
          }
        }
      }
    }
  };

  const onClickPwUpd = async () => {
    try {
      const res = await axios.patch(
        `http://${process.env.BACK_IP}/user/` + id,
        {
          password: pw,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.data.status === "success") alert("수정 성공");
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          const isLogged = await checkTokenStatus();
          if (isLogged) {
            getMyInfo();
          } else {
            dispatch({ type: "DEL_AUTH_INFO" });
            router.push(`/signIn/?returnUrl=${currentUrl}`);
          }
        }
      }
    }
  };

  return (
    <>
      {isLoggedIn && (
        <div className="a">
          <div>
            이메일: &nbsp;
            <input type="text" onChange={onChangeEmail} value={emailCH} />
            <button onClick={onClickEmailUpd}>수정</button>
          </div>
          <div>
            닉네임: &nbsp;
            <input type="text" onChange={onChangeNick} value={nickCH} />
            <button onClick={onClickNickUpd}>수정</button>
          </div>
          <div>
            비밀번호: &nbsp;
            <input
              type="password"
              placeholder="패스워드"
              onChange={onChangePw}
            />
            <button onClick={onClickPwUpd}>수정</button>
          </div>
          <div>
            <img
              width="380px"
              height="510px"
              src="imageedit_2_7402640519.png"
            />
          </div>
        </div>
      )}
      <style jsx>{`
        div.a {
          display: flex;
          gap: 10px;
          flex-direction: column;
          align-items: center;
          padding-top: 20px;
          padding-bottom: 10px;
          box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
            rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
        }
        img {
          opacity: 0.8;
        }
      `}</style>
    </>
  );
};

export default MyPage;
