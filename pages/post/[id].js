import axios from "axios";
import { PostCard } from "../../components/PostCard";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import wrapper from "../../store/configureStore";
import { useInput } from "../../hooks/useInput";
import { useRouter } from "next/router";
import { Card } from "antd";
import "antd/dist/antd.css";

const Detail = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const getPostOne = async () => {
    setLoading(true);
    const postRes = await axios.get(`http://${process.env.BACK_IP}/post/${id}`);

    const datas = postRes.data.data;
    console.log(datas);
    setPost(datas);
    setLoading(false);

    setDone(true);
  };

  const onClick = async () => {
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
      alert("삭제 되었습니다.");
      router.push("/post");
    }
  };
  const oneClickBack = () => {
    router.push("/post");
  };
  useEffect(() => {
    getPostOne();
  }, []);

  return (
    <>
      {loading && "Loading..."}
      {done && (
        <div>
          <Card title={post.content} style={{ width: 300 }}>
            <div>
              {post.images.map((e) => {
                return <img src={e.url} key={e.id} />;
              })}
              <p>Writer [ {post.user.nickname} ]</p>
            </div>
            <button onClick={oneClickBack} style={{ float: "left" }}>
              뒤로
            </button>
            <button onClick={onClick} style={{ float: "right" }}>
              삭제
            </button>
          </Card>
        </div>
      )}
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

export default Detail;
