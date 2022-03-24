import { Layout } from "../components/Layout";
import "../styles/globals.css"; // global css는 커스텀 app 컴포넌트에서만 가능하고, 커스텀 컴포넌트나 페이지에서 css를 불러와서 사용하기 위해서는 module화가 되어야함
import PropTypes from "prop-types";
import { wrapper } from "../store/configureStore";
import { useSelector, useDispatch } from "react-redux";

import { createStore } from "redux";
import { useRouter } from "next/router";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { persistedReducer } from "../reducers/persist";
import Head from "next/head";
import { useEffect } from "react";
import axios from "axios";

// Component에 페이지가 들어감
const App = ({ Component, pageProps }) => {
  // console.log("_app.js start");
  const store = createStore(persistedReducer);
  const persistor = persistStore(store);

  // console.log("_app.js end");

  return (
    <PersistGate persistor={persistor} loading={<div>loading...</div>}>
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>SNS</title>
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    </PersistGate>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(App); // 해당 페이지를 정의한 wrapper로 감쌀거야
