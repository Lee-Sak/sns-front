import "../styles/globals.css";

import { Layout } from "../components/Layout";
import "../styles/globals.css"; // global css는 커스텀 app 컴포넌트에서만 가능하고, 커스텀 컴포넌트나 페이지에서 css를 불러와서 사용하기 위해서는 module화가 되어야함
import PropTypes from "prop-types";
import wrapper from "../store/configureStore";

// Component에 페이지가 들어감
const App = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(App); // 해당 페이지를 정의한 wrapper로 감쌀거야
