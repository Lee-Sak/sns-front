import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

const MyPage = () => {
  const { id, isLoggedIn, email, nick } = useSelector((state) => state.user);
  const router = useRouter();
  const token = axios.defaults.headers.common["x-access-token"];
  const dispatch = useDispatch();

  const [pw, setPw] = useState("");
  const [nickCH, setnickCH] = useState("");
  const [emailCH, setemailCH] = useState("");

  const getMyInfo = async () => {
    const res = await axios.get("http://localhost:8000/user/" + id, {
      headers: {
        Authorization: token,
      },
    });
    const data = res.data.data.email;
    setnickCH(nick);
    setemailCH(data);
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

  useEffect(() => {
    try {
      const currentUrl = router.asPath;
      if (!isLoggedIn) {
        router.push(`/signIn/?returnUrl=${currentUrl}`);
        alert("로그인 먼저 진행하세요");
      }

      getMyInfo();
    } catch (e) {
      console.log(e);
    }
  }, []);
  const tryCatch = (func) => {
    try {
      func();
    } catch (e) {
      console.log(e);
    }
  };
  const onClickEmailUpd = async () => {
    const res = await axios.put(
      "http://localhost:8000/user/" + id,
      {
        email: emailCH,
        nickname: nickCH,
      },
      {
        headers: {
          Authorization: axios.defaults.headers.common["x-access-token"],
        },
      }
    );
    if (res.data.status === "success") alert("수정 성공");
  };

  const onClickNickUpd = async () => {
    const res = await axios.put(
      "http://localhost:8000/user/" + id,
      {
        nickname: nickCH,
      },
      {
        headers: {
          Authorization: axios.defaults.headers.common["x-access-token"],
        },
      }
    );
    if (res.data.status === "success") {
      dispatch({ type: "CH_NICK", data: nickCH });
      alert("수정 성공");
    }
  };

  const onClickPwUpd = async () => {
    const res = await axios.patch(
      "http://localhost:8000/user/" + id,
      {
        password: pw,
      },
      {
        headers: {
          Authorization: axios.defaults.headers.common["x-access-token"],
        },
      }
    );
    if (res.data.status === "success") alert("수정 성공");
  };

  return (
    <>
      <div className="a">
        <div>
          이메일: &nbsp;
          <input type="text" onChange={onChangeEmail} value={emailCH} />
          <button onClick={() => tryCatch(onClickEmailUpd)}>수정</button>
        </div>
        <div>
          닉네임: &nbsp;
          <input type="text" onChange={onChangeNick} value={nickCH} />
          <button onClick={() => tryCatch(onClickNickUpd)}>수정</button>
        </div>
        <div>
          비밀번호: &nbsp;
          <input type="password" placeholder="패스워드" onChange={onChangePw} />
          <button onClick={() => tryCatch(onClickPwUpd)}>수정</button>
        </div>
      </div>
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
      `}</style>
    </>
  );
};

export default MyPage;
