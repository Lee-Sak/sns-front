import axios from "axios";
import { PostCard } from "../../components/PostCard";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import wrapper from "../../store/configureStore";
import { useInput } from "../../hooks/useInput";
import { useRouter } from "next/router";
import { Card } from "antd";
import "antd/dist/antd.css";
import { checkTokenStatus } from "../../functions/check_token";
import { getFollower } from "../../functions/check_token";

const Detail = () => {
  const router = useRouter();
  const currentUrl = "/post";

  const { id } = router.query;
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.id);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [subCommentStatus, setCommentStatus] = useState(true);
  const [subComment, setSubComment] = useState("");
  const carouselRef = useRef([]);
  const [inputRefIndex, setinputRefIndex] = useState("");
  const [statusAddRefCom, setStatusAddRefCom] = useState(false);
  const [subcommentojb, setsubcommentojb] = useState([]);

  const taskToken = async () => {
    console.log(currentUrl, "page's", "taskToken()");
    const isLogged = await checkTokenStatus();
    if (isLogged) {
      getFollower(dispatch, router, currentUrl);
      getPostOne();
    } else {
      dispatch({ type: "DEL_AUTH_INFO" });
      router.push(`/signIn/?returnUrl=${currentUrl}`);
    }
  };

  useEffect(() => {
    taskToken();
  }, []);

  const getPostOne = async () => {
    try {
      setLoading(true);
      const postRes = await axios.get(
        `http://${process.env.BACK_IP}/post/${id}`
      );
      const datas = postRes.data.data;

      const commentRes = await axios.get(
        `http://${process.env.BACK_IP}/post/${id}/comment`
      );
      const commentsData = commentRes.data.data;

      const array_ = [];
      for (const e of commentsData) {
        if (e.subComment.length > 0) {
          const postRes = await axios.get(
            `http://${process.env.BACK_IP}/post/${e.id}/subcomment`
          );

          if (postRes.data.status === "success") {
            const data = postRes.data.data;
            const subarray = data.map((data) => {
              return {
                id: data.id,
                sub_comment: data.sub_comment,
                user_nick: data.user.nickname,
                user_id: data.user.id,
              };
            });

            array_.push({
              ...e,
              subarray,
            });
          }
        } else {
          const subarray = [];
          array_.push({
            ...e,
            subarray,
          });
        }
      }

      setPost(datas);
      setComments(array_);

      setLoading(false);

      setDone(true);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          const isLogged = await checkTokenStatus();
          if (isLogged) {
            getFollower(dispatch, router, currentUrl);
          } else {
            router.push(`/signIn/?returnUrl=${currentUrl}`);
          }
        }
      }
    }
  };

  const onClickDelete = async (id) => {
    try {
      const token = window.localStorage.getItem("token");
      const deleteRes = await axios.delete(
        `http://${process.env.BACK_IP}/post/comment/` + id,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (deleteRes.data.status === "success") {
        alert("정상적으로 삭제되었습니다.");
        getPostOne();

        // setComments((prev) => prev.filter((comm) => comm.id !== id));
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          const isLogged = await checkTokenStatus();
          if (isLogged) {
            getFollower(dispatch, router, currentUrl);
          } else {
            router.push(`/signIn/?returnUrl=${currentUrl}`);
          }
        }
      }
    }
  };

  const onClick = async () => {
    try {
      const token = window.localStorage.getItem("token");
      const deleteRes = await axios.delete(
        `http://${process.env.BACK_IP}/post/` + id,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (deleteRes.data.status === "success") {
        dispatch({ type: "DELETE_POST", data: Number(id) });
        alert("삭제 되었습니다.");
        router.push("/post");
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          const isLogged = await checkTokenStatus();
          if (isLogged) {
            getFollower(dispatch, router, currentUrl);
          } else {
            router.push(`/signIn/?returnUrl=${currentUrl}`);
          }
        }
      }
    }
  };
  const oneClickBack = () => {
    router.push("/post");
  };

  const onChangeComment = (e) => {
    setCommentText(e.target.value);
  };

  const onClickComment = async () => {
    try {
      const token = window.localStorage.getItem("token");
      const commentPost = await axios.post(
        `http://${process.env.BACK_IP}/post/${id}/comment`,
        { comment: commentText },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (commentPost.data.status === "success") {
        getPostOne();

        setCommentText("");
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          const isLogged = await checkTokenStatus();
          if (isLogged) {
            getFollower(dispatch, router, currentUrl);
          } else {
            router.push(`/signIn/?returnUrl=${currentUrl}`);
          }
        }
      }
    }
  };
  const onChangeServe = (e) => {
    setSubComment(e.target.value);
  };

  const onClickPostServeComment = async (commentId) => {
    try {
      const token = window.localStorage.getItem("token");

      const commentPost = await axios.post(
        `http://${process.env.BACK_IP}/post/${commentId}/subcomment`,
        { sub_comment: subComment },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (commentPost.data.status === "success") {
        getPostOne();
        setSubComment("");
        setStatusAddRefCom(false);
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          const isLogged = await checkTokenStatus();
          if (isLogged) {
            getFollower(dispatch, router, currentUrl);
          } else {
            router.push(`/signIn/?returnUrl=${currentUrl}`);
          }
        }
      }
    }
  };

  const addSubCommentDiv = (commentId) => {
    return (
      <div className="a">
        <textarea
          rows="3"
          cols="43"
          placeholder="subComment"
          onChange={onChangeServe}
          value={subComment}
        />
        <div>
          <button onClick={() => onClickPostServeComment(commentId)}>
            작성
          </button>
        </div>
      </div>
    );
  };

  const onClickAddSubComment = async (i) => {
    setStatusAddRefCom(true);
    setinputRefIndex(i);
  };

  const onClickDelSub = async (id) => {
    try {
      const token = window.localStorage.getItem("token");

      const deleteRes = await axios.delete(
        `http://${process.env.BACK_IP}/post/comment/subcomment/` + id,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (deleteRes.data.status === "success") {
        alert("정상적으로 삭제되었습니다.");
        getPostOne();
      }
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          const isLogged = await checkTokenStatus();
          if (isLogged) {
            getFollower(dispatch, router, currentUrl);
          } else {
            router.push(`/signIn/?returnUrl=${currentUrl}`);
          }
        }
      }
    }
  };
  return (
    <>
      {loading && "Loading..."}
      {done && (
        <>
          <div className="a">
            <h1>Post:</h1>
            <Card
              title={post.content}
              style={{ width: 300, backgroundColor: "#778899" }}
            >
              <div className="a">
                {post.images.map((e) => {
                  return <img src={e.url} key={e.id} />;
                })}
                <p>{post.sentence}</p>
                <p>Writer [ {post.nickname} ]</p>
              </div>
              {post.user_id === Number(userId) ? (
                <>
                  <button onClick={oneClickBack} style={{ float: "left" }}>
                    뒤로
                  </button>
                  <button onClick={onClick} style={{ float: "right" }}>
                    삭제
                  </button>
                </>
              ) : (
                <div>
                  <button onClick={oneClickBack}>뒤로</button>
                </div>
              )}
            </Card>
          </div>
          <div className="a">
            <h1>{"< Comment >"} </h1>
            {comments.map((e, i) => {
              return (
                <div key={e.id} ref={(elem) => (carouselRef.current[i] = elem)}>
                  <Card
                    size="small"
                    title={`Writer [${e.nick}]`}
                    style={{ width: 300, background: "#ffe4c4" }}
                  >
                    <p>{e.comment}</p>
                    {(Number(userId) === e.user_id || Number(userId) === 1) && (
                      <button
                        style={{ float: "left" }}
                        onClick={() => onClickDelete(e.id)}
                      >
                        삭제
                      </button>
                    )}
                    <button
                      style={{ float: "right" }}
                      onClick={() => onClickAddSubComment(i)}
                    >
                      답글
                    </button>
                  </Card>
                  <div className="a">
                    {e.subarray.length > 0 && <h2 color="blue">SubComment </h2>}

                    {e.subarray?.map((e) => {
                      return (
                        <div key={e.id}>
                          <Card
                            size="small"
                            title={`Writer [${e.user_nick}]`}
                            style={{
                              width: 200,
                              height: 150,
                              background: "#f5f5dc",
                            }}
                          >
                            <p>{e.sub_comment}</p>
                            {(Number(userId) === e.user_id ||
                              Number(userId) === 1) && (
                              <button onClick={() => onClickDelSub(e.id)}>
                                삭제
                              </button>
                            )}
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                  {inputRefIndex === i && addSubCommentDiv(e.id)}
                </div>
              );
            })}
            <div className="a">
              <h2>Comment Write:</h2>
              <textarea
                rows="6"
                cols="40"
                placeholder="sentence"
                onChange={onChangeComment}
                value={commentText}
              />
            </div>
            <button onClick={onClickComment}>write</button>
          </div>
        </>
      )}
      <style jsx>{`
        div.a {
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

export default Detail;
