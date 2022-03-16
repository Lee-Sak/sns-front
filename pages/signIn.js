import { Form, Input, Button } from "antd";
import Link from "next/link";
import { useInput } from "../hooks/useInput";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const SignIn = () => {
  const router = useRouter();
  const maxLen = (value) => value.length < 50;
  const email = useInput("", maxLen);
  const password = useInput("", maxLen);
  const dispatch = useDispatch();
  const { loginLoading, loginError, loginDone } = useSelector(
    (state) => state.user
  );
  const onSubmitForm = async () => {
    try {
      dispatch({ type: "LOG_IN_REQUEST" });
      const response = await axios.post(
        `http://${process.env.BACK_IP}/user/login`,
        {
          email: email.value,
          password: password.value,
        }
      );
      console.log(response);

      if (response.data.status === "success") {
        dispatch({ type: "LOG_IN_DONE" });
        axios.defaults.headers.common["x-access-token"] =
          response.data.data.token;
        if (router.query.returnUrl) {
          router.push(router.query.returnUrl);
        } else {
          router.push("/");
        }
        alert("Login Success!");
      }
    } catch (error) {
      alert("로그인 정보를 확인하세요!");
      dispatch({ type: "LOG_IN_ERROR" });
    }
  };
  return (
    <>
      {loginLoading && <div>loading...</div>}
      {loginError && <div>아이디와 비밀번호를 확인하세요..</div>}
      <div>
        <Form onFinish={onSubmitForm}>
          <div>
            <label htmlFor="user-id">이메일</label>
            <Input id="user-id" {...email} required />
            <label htmlFor="user-password">비밀번호</label>

            <Input id="user-password" type="password" {...password} required />
            <br />
            <Button type="primary" htmlType="submit" loading={false}>
              로그인
            </Button>
          </div>
        </Form>
      </div>
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

export default SignIn;
