import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <>
      <div>
        <img
          width="300px"
          height="450px"
          src="https://t1.daumcdn.net/cfile/tistory/11090E455020B14139"
        />
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

export default Home;
