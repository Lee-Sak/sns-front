import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const NavBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const onClick = () => {
    window.localStorage.removeItem("token");

    dispatch({ type: "DEL_AUTH_INFO" });
    dispatch({ type: "DEL_USER_INFO" });

    router.push("/");
    alert("logout success!");
  };
  return (
    <>
      <nav>
        <img src="http://www.idncomm.com/data/bbs/idn_pofolio_2012/2012122819221964.jpg" />
        <div>
          <Link href="/">
            <a className={router.pathname === "/" ? "active" : ""}>Home</a>
          </Link>

          <Link href="/post">
            <a
              className={
                router.pathname === "/post" ||
                router.pathname.split("/")[1] === "post"
                  ? "active"
                  : ""
              }
            >
              Post
            </a>
          </Link>
          {isLoggedIn ? (
            <Link href="/mypage">
              <a className={router.pathname === "/mypage" ? "active" : ""}>
                Mapage
              </a>
            </Link>
          ) : (
            <div>
              <Link href="/signIn">
                <a className={router.pathname === "/signIn" ? "active" : ""}>
                  SignIn
                </a>
              </Link>
              <Link href="/signUp">
                <a className={router.pathname === "/signUp" ? "active" : ""}>
                  SignUp
                </a>
              </Link>
            </div>
          )}
          {isLoggedIn && <a onClick={onClick}>Logout</a>}
        </div>
        <style jsx>{`
          nav {
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
            max-width: 100px;
            margin-bottom: 5px;
          }
          nav a {
            font-weight: 600;
            font-size: 18px;
          }
          .active {
            color: tomato;
          }
          nav div {
            display: flex;
            gap: 10px;
          }
        `}</style>
      </nav>
    </>
  );
};

export { NavBar };
