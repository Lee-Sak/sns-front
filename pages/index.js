import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { checkTokenStatus } from "../functions/check_token";
import { checkLogin, getFollower } from "../functions/check_token";

// SSR을 사용하지 않는 페이지는 redux-persist 모듈이 작동되어 새로고침을 하여도
// 지정한 store의 값은 유지 됨.
const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUrl = router.asPath;
  const { nick, isLoggedIn, id } = useSelector((state) => state.auth);

  const taskToken = async () => {
    console.log(currentUrl, "page's", "taskToken()");
    const isLogged = await checkTokenStatus();
    if (isLogged) {
      // 토큰값 재설정
      getFollower(dispatch, router, currentUrl);
    } else {
      dispatch({ type: "DEL_AUTH_INFO" });
      // router.push(`/signIn/?returnUrl=${currentUrl}`);
    }
  };

  useEffect(() => {
    taskToken();
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <div>
          <img width="380px" height="625px" src="imageedit_2_7402640519.png" />
        </div>
      ) : (
        <div>
          <img width="380px" height="800px" src="imageedit_2_7402640519.png" />
        </div>
      )}
      <style jsx>{`
        div {
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

export default Home;
