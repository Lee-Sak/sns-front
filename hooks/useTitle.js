import { useState } from "react";
import Head from "next/head";

const useTitle = (initial) => {
  const [title, setTitle] = useState(initial);

  return { title, setTitle };
};

const App = () => {
  const titleUpdater = useTitle("Loading...");
  const { title, setTitle } = titleUpdater;
  setTimeout(() => setTitle("Home"), 3000);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <div>Hi</div>
      </div>
    </>
  );
};

export default App;
