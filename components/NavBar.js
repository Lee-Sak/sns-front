import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const NavBar = () => {
  const router = useRouter();
  const token = axios.defaults.headers.common["x-access-token"];
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);
  const onClick = () => {
    axios.defaults.headers.common["x-access-token"] = "";
    dispatch({ type: "LOGOUT" });
    router.push("/");
    alert("logout success!");
  };
  return (
    <>
      <nav>
        <img src="/vercel.svg" />
        <div>
          <Link href="/">
            <a className={router.pathname === "/" ? "active" : ""}>Home</a>
          </Link>

          <Link href="/post">
            <a className={router.pathname === "/post" ? "active" : ""}>Post</a>
          </Link>
          {token ? (
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
