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
  const [status, setStatus] = useState(false);
  const onClick = () => {
    setStatus(true);
  };
  const onClickDelete = () => {
    setStatus(false);
  };
  return (
    <>
      {isLoggedIn && (
        <div>
          <Card
            title={`${nick}님`}
            extra={<a onClick={onClick}>More</a>}
            style={{ width: 170 }}
          >
            <p>follower : {follower?.length}</p>
            <p>following : {following?.length}</p>
          </Card>
        </div>
      )}
      {status && (
        <div>
          <Card
            title="follow list"
            extra={<a onClick={onClickDelete}>접기</a>}
            style={{ width: 170 }}
          >
            <p>
              follower :{" "}
              {follower.map((e) => {
                return `${e.nick}, `;
              })}
            </p>
            <p>
              following :{" "}
              {following.map((e) => {
                return `${e.nick}, `;
              })}
            </p>
          </Card>
        </div>
      )}

      <style jsx>{`
        div {
          display: inline;
        }
      `}</style>
    </>
  );
};

export default React.memo(UserProfile);
