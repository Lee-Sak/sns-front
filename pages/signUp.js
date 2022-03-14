import { Form, Input, Button } from "antd";
import Link from "next/link";
import { useInput } from "../hooks/useInput";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const SignUp = () => {
  const router = useRouter();

  const maxLen = (value) => value.length < 50;
  const email = useInput("", maxLen);
  const password = useInput("", maxLen);
  const nick = useInput("", maxLen);

  const onSubmitForm = async () => {
    try {
      const response = await axios.post("http://localhost:8000/user", {
        email: email.value,
        password: password.value,
        nickname: nick.value,
      });
      if (response.data.status === "success") {
        router.push("/signIn");
        alert("SignUp Success!");
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div>
        <Form onFinish={onSubmitForm}>
          <div>
            <label htmlFor="user-id">이메일</label>
            <Input id="user-id" {...email} required />
            <label htmlFor="user-password">비밀번호</label>
            <Input id="user-password" type="password" {...password} required />
            <label htmlFor="user-nick">닉네임</label>
            <Input id="user-nick" {...nick} required />
            <br />
            <Button type="primary" htmlType="submit" loading={false}>
              회원가입
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

export default SignUp;
