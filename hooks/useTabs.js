import { useState } from "react";

const content = [
  {
    tab: "Section 1",
    contents: "content of Section 1 ",
  },
  {
    tab: "Section 2",
    contents: "content of Section 2 ",
  },
];

const useTabs = (initialTab, allTabs) => {
  if (!allTabs || !Array.isArray(allTabs)) return;
  const [currentIndex, setCurrentIndex] = useState(initialTab);
  return {
    currentItem: allTabs[currentIndex],
    changeItem: setCurrentIndex,
  };
};

const App = () => {
  const { currentItem, changeItem } = useTabs(0, content);
  const { tab, contents } = currentItem;
  return (
    <>
      <div>
        {content.map((e, i) => (
          <button onClick={() => changeItem(i)} key={i}>
            {e.tab}
          </button>
        ))}
      </div>
      <div>
        <a>{contents}</a>
      </div>
    </>
  );
};

export default App;
