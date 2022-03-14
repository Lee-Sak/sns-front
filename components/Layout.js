import { NavBar } from "./NavBar";
import UserProfile from "./UserProfile";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";

const Layout = ({ children }) => {
  console.log("Layout Compo");
  const token = axios.defaults.headers.common["x-access-token"];
  const dispatch = useDispatch();

  const getUserInfo = async () => {
    if (token) {
      const res = await axios.get("http://localhost:8000/user/token", {
        headers: {
          Authorization: token,
        },
      });
      const data = res.data.data;
      dispatch({ type: "SET_USER_INFO", data });
    }
  };
  getUserInfo();

  const getFollower = async () => {
    let followerIds = [],
      followingIds = [];
    const res = await axios.get("http://localhost:8000/user/follower", {
      headers: {
        Authorization: axios.defaults.headers.common["x-access-token"],
      },
    });

    if (res.data.data) {
      followerIds = res.data.data.followers.map((e) => {
        return e.id;
      });
    }

    const res_1 = await axios.get("http://localhost:8000/user/following", {
      headers: {
        Authorization: axios.defaults.headers.common["x-access-token"],
      },
    });
    if (res_1.data.data) {
      followingIds = res_1.data.data.followings.map((e) => {
        return e.id;
      });
    }

    dispatch({ type: "follower", data: followerIds });
    dispatch({ type: "following", data: followingIds });
  };
  if (token) {
    getFollower();
  }
  return (
    <>
      <NavBar />
      <UserProfile token={token} />
      <div>{children}</div>
    </>
  );
};

export { Layout };
