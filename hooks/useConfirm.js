const useConfirm = (message, onConfirm, onCancel) => {
  if (!onConfirm && typeof callback !== "function") return;
  if (!onCancel && typeof onCancel !== "function") return;
  const confrimAction = () => {
    if (confirm(message)) {
      onConfirm();
    } else {
      onCancel();
    }
  };

  return confrimAction;
};

const App = () => {
  const deleteWorld = () => {
    console.log("deleting the world");
  };
  const abort = () => console.log("aborted");
  const confrimDelete = useConfirm("are you sure?", deleteWorld, abort);
  return (
    <>
      <button onClick={confrimDelete}>Delete the world</button>
    </>
  );
};

export default App;
