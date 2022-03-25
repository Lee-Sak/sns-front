import { Card } from "antd";
import "antd/dist/antd.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { checkTokenStatus } from "../functions/check_token";

const PostCard = ({
  idx,
  postId,
  userId,
  nick,
  content,
  imgUrl,
  sentence,
  getFollower,
  followerId,
  followingId,
  like,
  createdAt,
}) => {
  const { id } = useSelector((state) => state.auth);
  const { detailPostStatus, setDetialPostStatus } = useState(false);
  const dispatch = useDispatch();
  const [onePost, setOnePost] = useState(null);

  const router = useRouter();
  const currentUrl = router.asPath;
  const token = localStorage.getItem("token");

  const onClick = async (id) => {
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
        alert("삭제 되었습니다.");
        dispatch({ type: "DELETE_POST", data: Number(id) });
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

  const updatedForm = async (id) => {
    try {
      const token = window.localStorage.getItem("token");

      const postRes = await axios.get(
        `http://${process.env.BACK_IP}/post/${id}`,
        {
          headers: {
            Authorization: token,
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

  const onClickFollow = async () => {
    try {
      const token = window.localStorage.getItem("token");

      const followRes = await axios.post(
        `http://${process.env.BACK_IP}/user/${userId}/follow`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const { data, status } = followRes.data;
      if (status === "success") {
        getFollower();
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

  const onClickUnFollow = async () => {
    try {
      const token = window.localStorage.getItem("token");

      const followRes = await axios.put(
        `http://${process.env.BACK_IP}/user/${userId}/unfollow`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const { data, status } = followRes.data;
      if (status === "success") {
        getFollower();
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

  const onClickMore = () => {
    router.push(`/post/${postId}`);
  };

  const onClickLike = async (id) => {
    try {
      const token = window.localStorage.getItem("token");

      const followRes = await axios.patch(
        `http://${process.env.BACK_IP}/post/${id}/like`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const { data, status } = followRes.data;
      if (status === "success") {
        dispatch({
          type: "UPDATE_LIKE",
          data: id,
        });
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
  const onClickMainImg = () => {
    console.log("main img");
    router.push(`/post/${postId}`);
  };
  return (
    <>
      <Card
        key={idx}
        title={`${idx}. ${content}`}
        extra={<a onClick={onClickMore}>More</a>}
        style={{ width: 300, backgroundColor: "#778899" }}
      >
        <div onClick={onClickMainImg}>
          <img src={imgUrl} />
        </div>
        <div>
          <button onClick={() => onClickLike(postId)}>
            <img
              width="50"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOkAAADYCAMAAAA5zzTZAAAAt1BMVEX///9TZZv+/v7i4+QlNXgmNnhtfawjM3ff4OEcLXNKVYrZ3OchMXUlNXlAS4IwQYBMXpQtPHzp6/IUJ3Dp6ehRXY/Jzd0cLnRmcZ9hcaRxga9UZpqrrMH29/oTJnDf4uuEi7CYoLxWWpBkbZs2RoTFxtRqdJ+xts3x8vYAG2vOzdaHj7C3vNELIm+Bh6dweaIAF2nZ2N17g6qepL+ursKSmLcAD2fGxdHw8euNjrBdY5JJUoXIytzbvahJAAAOqUlEQVR4nO2dgX+iuBLHWSQvokFXo9K7LVhXq7iW11bPu70+//+/62UmAQGVAlYtlN/dZ7dbFfNlJpNJCIOm1apVq1atWrVq1apVq1atWrVq1apV65NIF7p1G2p9oPQs0qpg80ykFXDv0GaOozv9I3K0aoAGGKPtw8PqYX5E61FFUCXEPfNd33c55y6HPyPyu7sqxGZdQow5J8QwiAF/7iX/4b/1K2NTbbs0KDWocUyU9sB/yx58pU3HLZOEJoyZFH5VEVKQM3EJDdmUxL8sg1rUMlgFSNUIM25xMJ1BzXgs4owyQVwFUhV4NyaD7khN0omp1WW0IqTSpF5HmpTP254TkeesfPBq2q0IqbZ4ETiEst4unhg6QCq6bhUikjTpG8QjSty5pydI/+tXI/aqHO+JMhhJGX/SnTjpb0FqVcGmciztz4VJBQ4fxjmFsQdAWgGbKp4dscXISal7v5/WSJM2K0XqOGsOvkt5qx/OWCTr4LVSpNrOtiFnYOa94gx9txnYtOzjqQJ69tGk5nAs/TZ4xWlUi1RrE5NAcutO9r6LGjQbFSLVdJUbWGanHSd1ms3q2BSQ2h0TZ6XLbTC6ymgEvtt8/Y2ZA60CqTPBwGvY5liLBaRBUzhv4/WNE0wTy0wqucQMHMKR4a/jGa+Iu9BN/yFiLkMN1mmXeCFJkk5cWFOh9qytRXMGHXxXdNMtvkzctaOX3Kb9DjgvI3ztxEAHCNoY/ISXqWFuwmhVOiGToy2WgoNQ2tvFwxFyim5KuIUvj7SS27Q/5BBaib/2ogkvxl3ophtIKijhZV4ElWALE1fJmLmL9VLpu6Kbrpew4kBeVFJRSlTZS+doUiM5XWuA5wqT/mqZ2E1fdlpZXVdaT3sUYwjkBctFbCxF5wXSRyLyRMMwZ15Zu6kKPN5cRFYxB+dTL3ROzCYQVJj1X47O6z5rZfVdxbWz0aTUXISX0vQg8gJo843DOlrw+q1bXUSKa+7jOhnH6ZpyTvhL5kfCeWc2xqsuZhW3bnQhSdARY3htgt9HeiH85OFY2hzcUzA54c9eWUGVjz7gorXBW+OIc8IPAzWaClK0+aSsvVSTqO0OMyzBupzs401kOEVSWOolcop+6yYXkjSpSN5FuDHM3jjuvJK0sSflZSVV4ag9g+kaM9xVdAjB0WcAYwySkoC0jGNpQDrx8XqpOYvNPGMp0r1VBVKva8JlYCPI7dVrWpJU/FduUm2zxMv69mx0YFI5ZasKqZiuQfoTma7tX6sWqZiuUYvCdC0KGiFtlp8Uu2J/iiY1/GkMNCRVsbfkpNKkIvuxKONP2qFNZTJYclK1SuRNXVxriE7X5OsqcaiATSXXI+xUEdMx/nQEVK1pl5xUojg/XFg0sfhUXTANnVerjE0l1ojZaoYdN2kkwS85qTKgmK4ZkNGanXGSVNm0UQ2baqOZTcVgSl82yf3JQTJYfpvKyLvCzUeUz/oJULWw3yh/jiS5xHRN5PZGYrom36BIS++9EmzrwtZWuLqWNKkilYNMmUkl11huazD4yklwBvO5ZunHU0m6ecHdysF07RDVa0bHU7WOdJL0wC8+g7BN46GrpmuHbZQRK2HTcG3whD6jtbFhG04YbEbhalFFT74hSBwyra5EgD+RsEFiugZDjOEfu9QSJoNJ0uTGyU9tW3XNZYHbW/fTteS7jpG6mzSIT2dU1QfxmpKYrt15R9oXsWlkbVBE6fFphfe8fRZe1Y4nV07XyNPRq2f4poYaToEU7wpiBrGIZZFDiV+T2bYd9d+8rHr+j+ybevoVZ4q5PQmmawdfossUCa60BWv4uCsrTX5rMtaKGTXYQFJER89rcDhtBMv2sCfn/ngMwbPRVAtmyqb7m9tOyeTDRcSH89go/ydiHzzhlbitwcBr3EPv+PHxXV64nwOvKqYKki1xHviytdjH57ytPUcJCPVbZ2tj0+ky2IV+4rsdb4D99C8L3o8pYSqu6PmuO995OX1YP29PwRHS4IhbEy/2G+asf+JqfuRkAe1rC28hORKKghvfxP8UJ0YGc8m6ffTr05uqa/1RIXlHrKV+s/AZTmKIvz21bSHpG4+dJecu3HjrHhPck2vD5hYcdpnbW41POEsK6WaWuK03m/zWU/ykho32tqZtyIv5w+SiSvz7oyneePKQrueuy8TZs9CH7SXZOJlJ5RufOKeM0ZwSn3BnoxBjv99R17yVyQx5Zbj7lNqZ4lbVnHR5u2eX43FhGYOYfvZtLtIAz7AFwcJokEvMiM1Rwvb2n33ooxAp/96kgqrPZQ+MzqL14mIuZeTbYSh3jA9N8l6APyK4N9adqnAfaavz1MH9f7C/1d2+35VU3pKRVHMWQ85lXzVs3M2fKSThbRztlpmfU8Iekmr9LRETGAy7TK00vH/W9XAf1ruoojtvWq6NfdXGzd0ZOJOkJKP3qnudkTTeDk3f3bk2vkot5q+CmxEzNeUd20S+pr3tMfh6uY09l03xVnSWmnAmhEYzONg0MoS3n6mrBj1iupvIKcjYmBRFYbU72FYakGY9uCI1WO9763tWtbAnSu8NuqLX3naXTLyABuezMDf6qOlVJEW/g65akNSyZ3/+58+sugP3Icp7gVbzdusON4mKisRv7fLYMzttYFM4mwVIYfBjgjSz/ujBTfpgUwfdqr2dEtcEa1pwXc1eBgmD/tG7kqVZ70yrmPfiCcpF2qWQi7tzx+u3Fw8dvvRxS6tlYfedTfYTq4/ExDYH/dS6EimDAGx2VvNhz+fcxuwb9xyJ1OVulCsU5UdF770WKQU2ynxu2tg1MfcQf7Jld9MvuCpwHdJc/fTPP3qYfsLnLDmRgn8SarpkNb6Y496EtIuDCSTLILAmIcx0Ow+ji19TONt77bykBlhTRltIQ03f7UzaYSS6GOh1+6m0KYwnFAITY9z3u/OnfSWKS66xXzki9eRshTKTu9yYDVeLcWTedtFF52vHXpE5QCTqtt6et4vRODEXuSCoJDWv1E/RpiJzMIejdt9LXDK6JCU2+poRCWwKYcif6we6MOdHkHb/yK4fIu8lkZm46pwfnuUebfTZ/bT77fu3rPoeZvihJa9jUO1jSLNLkBpRm14YLt7oK5NiRNqvOVyYLtboa5OSgPSyecKRRt/QphdGSza6Jk39UE1ak9ak19QtSA33q5CSL0P6dWz6hUj5m/c1SC3e6l9jRppo9E1sWpNeUrch/f5lSGubXlJnr/eWi/Tr2LQmPfmhmrQmrUmvqZo0/UM1aU1ak15TX43UqklPfKhkpOH+8OkX8F6JWvl+Gu7Df6s8qZLz06x2Pw1AB/CMgCqTBr7baA5+Xn0dqRXZiH64r0424oOuZ4SHHTRvQZpi0yTwR5HCjeVXJyXhA7re0wdRiliEd9DfxHuzgZ6Jut893FBPLbmFTbMUhDkXNrSofBBN4/fVbWrOfqkqesc1aES35hdnjYGK496INF2D0OaFOSOgDVl551Y2PW1VbFnk2Z+FMGMWlce9Oimx00mhGlDUrAVBtbjrfkKbNhvKg88wqx533ZvZ9L2IJIHfMWt6U+N99CakeFfm+6TyiSopgUmP5AUnJfvozWxKiE3+yWBT9TS2Ew6cgRNr9UW/5+o2tZiRgTRw4UbGHCPedgXaiJFeOUeCwgjWAWmkRTE7YBKHGLoCUD8cGFXWWIEb7WWxFS+o6rY/1rVJjWOkjWOhuKkGnMYgUKr9Y+cniN/RM4gz8eJ3xBfxXiBN12Gb8yt58pCUFKtyUCwiGYz881sYKtaMwV6NpNelGv6UhRPRCLosRKRilSuKZg7M+vU7igZ63Os1NLhscgiYnfMo+eC1C+VQrkhKqdH5OetGNevaNrOVeqtm0qxnC0D/mWGJDlKwalBeUgy+1OTJ2jNsL5NPg7nOB0HiwPxXh1N4IqwizWTUc0ihpqX4Qlk2L1pCDmoBWFhZjVC39TT4KFCVgwz+6pny4aLEneaqeVWcFCsqUSpBjQPhaTfZv4ODoFKQU6aDE9cGSnF4Uz108+I2tSSgJe1noBFDYZFEeMH2n18Phv6iqOIo/9qy6h1Ud9k/t/CypFhlxcD8N0qKP8myV0BLGH97lKhnRVwZi5rPpo21wwzCO0FdoovbFGvQslhpVghPruvLUoji3EM/Fie/t/l9rgc35X9zfEaYBRUbg2evX55UdEPKev/733Aa1zqog9hyDVV7xlyuXxvngoqP//rpy3hAmfu2v3qQi5TCHfH5vZdPoVByXF5QB7E99SkWMoQqdW8qbSwIiqPLY4sbQdW757COTRbOA5vmuSMe4vxBbbr43Ku/XgoPJlhrmc+eBsWNKkE7IejLOnxWTW5SImz649u3HxkEb8LMgcSqHBzTQiYz0K9Md9U8J80f3FsmgdMmOgPf7j03J6mMlN3s6slh5Mi9iuofqh2joctkbzVsPv+VOllL02CwpSaW9xPnrJehBOdJUqxbLvI3yt4VxfdgCAy89xgpsjraeO0KU4hOLeKw23ocFFRjy+UZMyxOFnlCUYIUax2BMlV5tfChZMa+csXRQwcrCBsmn3GP1hgWVMsMqofx3i5X0I2Q6hh7T5dCPl4fWRaGdaenvnK/aKLtWq6qcmaxImWCsbawOLPwoFjCh6N8QTd64sdDjoUfrcySQQaG7/QaHeq19txnshRYSm3p906tCEZQsHHaLsKpmuKsX3pBGpdVROZ+Lyv9pPtGVsK81d+mzOEM670jn5DoXaLfvPzYX68tgKqNW0ucZdqZpXI/f37wcKfE4QOzLuRYmLMUciic9hPDfAiL6ObkDN1rNS0SJqaTcer5jSxwaqOpH5vr5PZeMVWwJ5GrscVQdaef8liM08/LUChpZzhsWn/94geTgPzi3Fz6mzMK9+hFAvYBxWnSqFWdxV3rHD0XGl0OW3uOsp4Qp3+Ozq2pqmsqf1DGkT/J3VL7H3Vt/5v9X+qSw/vfnPWcpLbzfQ/Kc5QPt+f5X5D8vitvm86pjyQtg74AYq1atWrVqlWrVq1atWrVyq//A2nW8SCUmYoWAAAAAElFTkSuQmCC"
            ></img>
          </button>
          Like: {like}
        </div>
        <div>
          {userId !== Number(id) &&
            (followerId?.includes(userId) ? (
              <button onClick={onClickUnFollow}>언팔로우</button>
            ) : (
              <button onClick={onClickFollow}>팔로우</button>
            ))}
          <p>{sentence} </p>

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
            <div>{createdAt}</div>
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
