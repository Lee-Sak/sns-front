import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Card } from "antd";
import "antd/dist/antd.css";

const UserProfile = ({ token, getFollower }) => {
  const { nick, isLoggedIn, follower, following } = useSelector(
    (state) => state.user
  );

  return (
    <>
      {isLoggedIn && (
        <Card
          title={`${nick}님`}
          extra={<a href="#">More</a>}
          style={{ width: 200 }}
        >
          <p>follower : {follower?.length}</p>
          <p>following : {following?.length}</p>
        </Card>
      )}
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
    </>
  );
};

export default React.memo(UserProfile);
