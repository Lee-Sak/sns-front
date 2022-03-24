import axios from "axios";
import { PostCard } from "../../components/PostCard";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { wrapper } from "../../store/configureStore";
import { useInput } from "../../hooks/useInput";
import { useRouter } from "next/router";
import imageCompression from "browser-image-compression";
import { checkLogin } from "../../functions/check_token";
import { getFollower } from "../../functions/check_token";
import { checkTokenStatus } from "../../functions/check_token";
import jwt_decode from "jwt-decode";

// SSR을 사용하는 페이지라 STATE가 초기화 됨
const Post = () => {
  console.log("post comp start");
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
    sentence,
    followerId,
    followingId,
  } = useSelector((state) => state.post);

  const dispatch = useDispatch();
  const router = useRouter();
  const currentUrl = router.asPath;

  const taskToken = async () => {
    console.log(currentUrl, "page's", "taskToken()");
    const isLogged = await checkTokenStatus();
    if (isLogged) {
      // 토큰값 재설정
      const token = window.localStorage.getItem("token");
      const { exp, id, nick } = jwt_decode(token);

      dispatch({
        type: "SET_AUTH_INFO",
        data: {
          id,
          nick,
        },
      });
      getFollower(dispatch, router, currentUrl);
    } else {
      dispatch({ type: "DEL_AUTH_INFO" });
      router.push(`/signIn/?returnUrl=${currentUrl}`);
    }
  };

  useEffect(() => {
    taskToken();
  }, []);

  // const storage = JSON.parse(localStorage.getItem("persist:root"));
  // const storageUser = JSON.parse(storage.user);
  // const jwtToken = storageUser.token;

  // action이 dispatch 될 때마다 selector는 항상 실행
  // selector의 return 값이 달라지면 useSelector를 사용하는 컴포넌트는 re-render

  const onChange = (e) => {
    dispatch({ type: "SET_CONTENT", data: e.target.value });
  };

  const onChangeSentence = (e) => {
    dispatch({ type: "SET_SENTENCE", data: e.target.value });
  };

  const getPosts = async () => {
    try {
      dispatch({ type: "LOAD_POST_REQUEST" });
      const postRes = await axios.get(`http://${process.env.BACK_IP}/post`);
      const datas = postRes.data.data;
      dispatch({ type: "LOAD_POST_SUCCESS", data: datas });
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
      const token = window.localStorage.getItem("token");
      const formData = new FormData();
      for (const e of files) {
        formData.append("files", e);
      }
      formData.append("content", content);
      formData.append("sentence", sentence);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      };

      const response = await axios.post(
        `http://${process.env.BACK_IP}/post`,
        formData,
        config
      );
      const { status, data } = response.data;

      if (status === "success") {
        // dispatch({ type: "CREATE_POST_SUCCESS", data: post });
        getPosts();
      } else {
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

  const handleFileOnChange = async (e) => {
    let file = e.target.files[0]; // 입력받은 file객체
    // 이미지 resize 옵션 설정 (최대 width을 100px로 지정)
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 300,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      dispatch({ type: "ADD_FILES", data: compressedFile });
      // resize된 이미지의 url을 받아 fileUrl에 저장
      const promise = imageCompression.getDataUrlFromFile(compressedFile);
      promise.then((result) => {
        dispatch({ type: "ADD_IMAGE_SOURCE", data: result });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onClickImgDel = (i) => {
    dispatch({ type: "DELETE_IMG", data: Number(i) });
  };
  const addUpdate = async () => {
    try {
      const token = window.localStorage.getItem("token");
      const formData = new FormData();
      for (const e of files) {
        formData.append("files", e);
      }
      formData.append("content", content);
      formData.append("sentence", sentence);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      };

      const response = await axios.put(
        `http://${process.env.BACK_IP}/post/` + postId + `?ids=${imgId}`,
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
  // pre(back) redner : back start -> back end
  // client render : clinet -> back start -> back end
  // re render(dispatch) :
  console.log("post comp end");

  return (
    <>
      {loadPostLoading && <div>loading...</div>}
      {addPostStatus ? (
        <div>
          <h2>이미지 미리보기</h2>
          <input type="file" onChange={handleFileOnChange} />
          {imgSrc.map((e, i) => {
            return (
              <div key={i} className="preview">
                {e && <img src={e} alt="preview-img" />}
                <button onClick={() => onClickImgDel(i)}>지우기</button>
              </div>
            );
          })}
          <input placeholder="title" value={content} onChange={onChange} />
          <textarea
            rows="6"
            cols="40"
            placeholder="sentence"
            value={sentence}
            onChange={onChangeSentence}
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
                sentence={post.sentence}
                userId={post.user_id}
                postId={post.id}
                imgUrl={post.img_url}
                content={post.content}
                nick={post.nickname}
                getFollower={getFollower}
                followerId={followerId}
                followingId={followingId}
                like={post.like}
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
    context.store.dispatch({ type: "LOAD_POST_REQUEST" });
    const postRes = await axios.get(`http://${process.env.BACK_IP}/post`);
    const datas = postRes.data.data;
    context.store.dispatch({ type: "LOAD_POST_SUCCESS", data: datas });
  }
);
export default Post;
