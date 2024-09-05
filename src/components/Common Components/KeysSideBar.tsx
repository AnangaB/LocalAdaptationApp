import { useEffect, useState } from "react";

type KeysSideBarProps = {
  keys: string[];
  sideBarButtonOnClick: (text: string) => void;
  activeButtonName: string;
};

const KeysSideBar: React.FC<KeysSideBarProps> = ({
  keys,
  sideBarButtonOnClick,
  activeButtonName,
}) => {
  const [keysGroup, setKeysGroup] = useState<string[][]>([]);

  const [displayingKeysIndex, setDisplayingKeysIndex] = useState<number>(0);

  useEffect(() => {
    if (keys) {
      const keysCopy = keys;
      const groupedKeys = [];

      if (keysCopy.length < 20) {
        groupedKeys.push(keysCopy);
      } else {
        while (keysCopy.length > 0) {
          groupedKeys.push(keysCopy.splice(0, 20));
        }
      }
      console.log(groupedKeys);

      setKeysGroup(groupedKeys);
    }
  }, [keys]);

  const goBackPage = () => {
    if (keysGroup && keysGroup.length > 0) {
      console.log(
        (displayingKeysIndex - 1) % keysGroup.length,
        keysGroup.length
      );
      setDisplayingKeysIndex(
        (displayingKeysIndex - 1 + keysGroup.length) % keysGroup.length
      );
    }
  };

  const goForwardPage = () => {
    if (keysGroup && keysGroup.length > 0) {
      setDisplayingKeysIndex((displayingKeysIndex + 1) % keysGroup.length);
    }
  };

  return (
    <nav className="container-fluid">
      {keysGroup &&
        keysGroup[displayingKeysIndex] &&
        keysGroup[displayingKeysIndex].map((key, index) => (
          <button
            key={`${key}${index}`}
            className={
              activeButtonName == key
                ? "btn btn-danger w-100 mt-1"
                : "btn btn-dark w-100 mt-1"
            }
            onClick={() => sideBarButtonOnClick(key)}
          >
            {key}
          </button>
        ))}

      {keysGroup && keysGroup.length > 1 && (
        <div className="d-flex justify-content-between p-1">
          <button className="btn btn-dark" onClick={goBackPage}>
            <i className="bi bi-arrow-left-square"></i>
          </button>
          <button className="btn btn-dark" onClick={goForwardPage}>
            <i className="bi bi-arrow-right-square"></i>
          </button>
        </div>
      )}
    </nav>
  );
};

export default KeysSideBar;
