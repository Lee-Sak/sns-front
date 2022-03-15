import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <>
      {process.env.BACK_IP}
      <h1>home</h1>
    </>
  );
};

export default Home;
