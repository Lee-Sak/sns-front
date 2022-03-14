import { Card } from "antd";
import "antd/dist/antd.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const PostCard = ({ idx, postId, userId, nick, content, imgUrl }) => {
  const { id, follower, following } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onClick = async (id) => {
    const deleteRes = await axios.delete("http://localhost:8000/post/" + id, {
      headers: {
        Authorization: axios.defaults.headers.common["x-access-token"],
      },
    });
    if (deleteRes.data.status === "success") {
      dispatch({ type: "DELETE_POST", data: Number(id) });
    }
  };

  const updatedForm = async (id) => {
    const postRes = await axios.get(`http://localhost:8000/post/${id}`, {
      headers: {
        Authorization: axios.defaults.headers.common["x-access-token"],
      },
    });
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
      },
    });
  };
  const getFollower = async () => {
    const res = await axios.get("http://localhost:8000/user/follower", {
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

  const onClickFollow = async () => {
    const followRes = await axios.post(
      `http://localhost:8000/user/${userId}/follow`,
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
      `http://localhost:8000/user/${userId}/unfollow`,
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
  return (
    <>
      <Card
        key={idx}
        title={`${idx}. ${content}`}
        extra={<a href="#">More</a>}
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
        {userId === Number(id) && (
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
      <div></div>
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
