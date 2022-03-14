import { useAxios } from "../../functions/useAxios";
let a = 0;
const App = () => {
  const { loading, data, error, refetch } = useAxios({
    url: "https://yts.mx/api/v2/list_movies.json",
  });
  console.log(loading, data, error);
  console.log(a++);
  return (
    <>
      <h1>{data && data.status}</h1>
      <h2>{loading && "loading"}</h2>
      <button onClick={refetch}>refetch</button>
    </>
  );
};

export default App;
