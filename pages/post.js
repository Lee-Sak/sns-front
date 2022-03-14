import axios from "axios";
import { PostCard } from "../components/PostCard";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import wrapper from "../store/configureStore";
import { useInput } from "../hooks/useInput";
import { useRouter } from "next/router";

const Post = () => {
  const maxLen = (value) => value.length < 100;

  const router = useRouter();

  const dispatch = useDispatch();

  // action이 dispatch 될 때마다 selector는 항상 실행
  // selector의 return 값이 달라지면 useSelector를 사용하는 컴포넌트는 re-render
  const {
    loadPostDone,
    loadPostLoading,
    data,
    addPostStatus,
    files,
    imgSrc,
    updatePostStatus,
    content,
    imgs,
    postId,
    imgId,
  } = useSelector((state) => state.post);
  const { isLoggedIn } = useSelector((state) => state.user);

  const onChange = (e) => {
    dispatch({ type: "SET_CONTENT", data: e.target.value });
  };

  useEffect(() => {
    const currentUrl = router.asPath;
    if (!isLoggedIn) {
      router.push(`/signIn/?returnUrl=${currentUrl}`);
      alert("로그인 먼저 진행하세요");
    }
  }, []);
  const getPosts = async () => {
    dispatch({ type: "LOAD_POST_REQUEST" });
    const postRes = await axios.get("http://localhost:8000/post");
    const datas = postRes.data.data;
    dispatch({ type: "LOAD_POST_SUCCESS", data: datas });
  };

  // console.log(loadPostLoading);
  // console.log("data", data);
  // 백에서 pre렌더링 이후 pre render된 html을 클라이언트에게 보냄
  // js를 다운이 완료되면 useEffect를 클라이언트 단에서 바로 실행
  // dispatch가 차례대로 큐에 들어감
  // dispatch한 객체의 변화가 있으면 차례대로 리렌더링!!!....

  const addPostForm = () => {
    dispatch({ type: "ADD_POST_FORM" });
  };

  const deletePostForm = () => {
    dispatch({ type: "DELETE_POST_FORM" });
  };
  const addPost = async () => {
    try {
      const formData = new FormData();
      for (const e of files) {
        formData.append("files", e);
      }
      formData.append("content", content);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: axios.defaults.headers.common["x-access-token"],
        },
      };

      const response = await axios.post(
        "http://localhost:8000/post",
        formData,
        config
      );
      const { status, data } = response.data;

      if (status === "success") {
        const post = {
          id: data.id,
          content: data.content,
          user_id: data.user.id,
          nickname: data.user.nickname,
          img_url: data.images[0].url,
        };
        // dispatch({ type: "CREATE_POST_SUCCESS", data: post });
        getPosts();
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        dispatch({ type: "ADD_IMAGE_SOURCE", data: reader.result });
        resolve();
      };
    });
  };

  const onChangeFile = (e) => {
    encodeFileToBase64(e.target.files[0]);
    const file = e.target.files[0];
    dispatch({ type: "ADD_FILES", data: file });
  };
  if (updatePostStatus) {
    window.scrollTo(0, 0);
  }

  const onClickImgDel = (i) => {
    dispatch({ type: "DELETE_IMG", data: Number(i) });
  };
  const addUpdate = async () => {
    const formData = new FormData();
    for (const e of files) {
      formData.append("files", e);
    }
    formData.append("content", content);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: axios.defaults.headers.common["x-access-token"],
      },
    };

    const response = await axios.put(
      "http://localhost:8000/post/" + postId + `?ids=${imgId}`,
      formData,
      config
    );
    const { status, data } = response.data;
    if (status === "success") {
      const post = {
        id: data.id,
        content: data.content,
        user_id: data.user.id,
        nickname: data.user.nickname,
        img_url: data.images[0].url,
      };
      getPosts();
      // dispatch({ type: "UPDATE_POST_SUCCESS", data: { post, id: data.id } });

      dispatch({ type: "DELETE_POST_FORM" });
      alert("update success!");
    }
  };
  // pre(back) redner : back start -> back end
  // client render : clinet -> back start -> back end
  // re render(dispatch) :
  return (
    <>
      {loadPostLoading && <div>loading...</div>}
      {addPostStatus ? (
        <div>
          <h2>이미지 미리보기</h2>
          <input type="file" onChange={onChangeFile} />
          {imgSrc.map((e, i) => {
            return (
              <div key={i} className="preview">
                {e && <img src={e} alt="preview-img" />}
                <button onClick={() => onClickImgDel(i)}>지우기</button>
              </div>
            );
          })}
          <textarea
            rows="6"
            cols="40"
            placeholder="content"
            value={content}
            onChange={onChange}
          />
          {updatePostStatus ? (
            <button onClick={addUpdate}>수정</button>
          ) : (
            <button onClick={addPost}>추가</button>
          )}
          <button onClick={deletePostForm}>닫기</button>
        </div>
      ) : (
        <div>
          <button onClick={addPostForm}>추가</button>
          <button>선택삭제</button>
        </div>
      )}
      {loadPostDone && (
        <>
          <div>
            {data?.map((post, i) => (
              <PostCard
                idx={i}
                key={post.id}
                userId={post.user_id}
                postId={post.id}
                imgUrl={post.img_url}
                content={post.content}
                nick={post.nickname}
              />
            ))}
          </div>
        </>
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
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    console.log("server");
    context.store.dispatch({ type: "LOAD_POST_REQUEST" });
    const postRes = await axios.get("http://localhost:8000/post");
    const datas = postRes.data.data;
    context.store.dispatch({ type: "LOAD_POST_SUCCESS", data: datas });
  }
);
export default Post;
