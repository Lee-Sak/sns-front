const useNotification = (title, options) => {
  if (typeof window !== "undefined") {
    if (!("Notification" in window)) {
      // window 객체안의 키값확인
      return;
    }
  }
  const fireNotif = () => {
    if (typeof Notification !== "undefined") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        } else {
          return;
        }
      });
    }
  };
  return fireNotif;
};

const App = () => {
  const trigeerNotfi = useNotification("can i steal yoru kimchi?", {
    body: "i love kimchi",
  });
  return (
    <>
      <h1>hello</h1>
      <button onClick={trigeerNotfi}>Hello</button>
    </>
  );
};

export default App;
