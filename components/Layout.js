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
      const res = await axios.get(`http://${process.env.BACK_IP}/user/token`, {
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
    const res = await axios.get(`http://${process.env.BACK_IP}/user/follower`, {
      headers: {
        Authorization: axios.defaults.headers.common["x-access-token"],
      },
    });

    if (res.data.data) {
      followerIds = res.data.data.followers.map((e) => {
        return { id: e.id, nick: e.nickname };
      });
    }

    const res_1 = await axios.get(
      `http://${process.env.BACK_IP}/user/following`,
      {
        headers: {
          Authorization: axios.defaults.headers.common["x-access-token"],
        },
      }
    );
    if (res_1.data.data) {
      followingIds = res_1.data.data.followings.map((e) => {
        return { id: e.id, nick: e.nickname };
      });
    }

    dispatch({ type: "follower", data: followerIds });
    dispatch({ type: "following", data: followingIds });
  };
  if (token) {
    getFollower();
  }
  return (
    <div className="container">
      <div className="img_item">
        <NavBar />
        <UserProfile token={token} />
        {children}
      </div>
      <style jsx>{`
        div.container {
          width: 100vw;
          height: 100vh;
        }

        div.img_item {
          margin: 0 auto;

          background-image: url("photo-1553095066-5014bc7b7f2d.jp");
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export { Layout };
