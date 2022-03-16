import { Card } from "antd";
import "antd/dist/antd.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

const PostCard = ({ idx, postId, userId, nick, content, imgUrl, sentence }) => {
  const { id, follower, following } = useSelector((state) => state.user);
  const { detailPostStatus, setDetialPostStatus } = useState(false);
  const dispatch = useDispatch();
  const [onePost, setOnePost] = useState(null);
  const router = useRouter();

  const onClick = async (id) => {
    const deleteRes = await axios.delete(
      `http://${process.env.BACK_IP}/post/` + id,
      {
        headers: {
          Authorization: axios.defaults.headers.common["x-access-token"],
        },
      }
    );
    if (deleteRes.data.status === "success") {
      dispatch({ type: "DELETE_POST", data: Number(id) });
    }
  };

  const updatedForm = async (id) => {
    const postRes = await axios.get(
      `http://${process.env.BACK_IP}/post/${id}`,
      {
        headers: {
          Authorization: axios.defaults.headers.common["x-access-token"],
        },
      }
    );
    const datas = postRes.data.data;
    const urls = datas.images.map((e) => {
      return e.url;
    });
    const ids = datas.images.map((e) => {
      return e.id;
    });
    dispatch({
      type: "UPDATE_POST_FORM",
      data: {
        content: datas.content,
        image: urls,
        postId: id,
        ids,
        sentence: datas.sentence,
      },
    });
  };
  const getFollower = async () => {
    const res = await axios.get(`http://${process.env.BACK_IP}/user/follower`, {
      headers: {
        Authorization: axios.defaults.headers.common["x-access-token"],
      },
    });

    let followerIds = [],
      followingIds = [];

    if (res.data.data) {
      followerIds = res.data.data.followers.map((e) => {
        return e.id;
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
        return e.id;
      });
    }

    dispatch({ type: "follower", data: followerIds });
    dispatch({ type: "following", data: followingIds });
  };

  const onClickFollow = async () => {
    const followRes = await axios.post(
      `http://${process.env.BACK_IP}/user/${userId}/follow`,
      {},
      {
        headers: {
          Authorization: axios.defaults.headers.common["x-access-token"],
        },
      }
    );
    const { data, status } = followRes.data;
    if (status === "success") {
      getFollower();
    }
  };

  const onClickUnFollow = async () => {
    const followRes = await axios.put(
      `http://${process.env.BACK_IP}/user/${userId}/unfollow`,
      {},
      {
        headers: {
          Authorization: axios.defaults.headers.common["x-access-token"],
        },
      }
    );
    const { data, status } = followRes.data;
    if (status === "success") {
      getFollower();
    }
  };

  const onClickMore = () => {
    router.push(`/post/${postId}`);
  };

  return (
    <>
      <Card
        key={idx}
        title={`${idx}. ${content}`}
        extra={<a onClick={onClickMore}>More</a>}
        style={{ width: 300 }}
      >
        <div>
          <img src={imgUrl} />
        </div>
        <div>
          {userId !== Number(id) &&
            (follower.includes(userId) ? (
              <button onClick={onClickUnFollow}>언팔로우</button>
            ) : (
              <button onClick={onClickFollow}>팔로우</button>
            ))}
          <p>Writer [ {nick} ]</p>
        </div>
        {(userId === Number(id) || Number(id) === 1) && (
          <>
            <button
              onClick={() => updatedForm(postId)}
              style={{ float: "left" }}
            >
              수정
            </button>
            <button onClick={() => onClick(postId)} style={{ float: "right" }}>
              삭제
            </button>
          </>
        )}
      </Card>
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
      `}</style>
    </>
  );
};

export { PostCard };
