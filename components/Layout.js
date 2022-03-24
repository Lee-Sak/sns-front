import { NavBar } from "./NavBar";
import UserProfile from "./UserProfile";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { getFollower } from "../functions/check_token";
import { checkLogin } from "../functions/check_token";

const Layout = ({ children }) => {
  console.log("Layout Compo start");

  // const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const router = useRouter();
  const currentUrl = router.asPath;
  console.log("page:", currentUrl);

  console.log("Layout Compo end");

  return (
    <div className="container">
      <div className="img_item">
        <NavBar />
        <UserProfile />
        {children}
      </div>
      <style jsx>{`
        div.container {
          width: 100vw;
          height: 100vh;
        }

        div.img_item {
          margin: 0 auto;

          background-image: url("photo-1553095066-5014bc7b7f2d.jpg");
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
