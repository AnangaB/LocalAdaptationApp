import * as React from "react";
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
      let keysCopy = keys;
      const groupedKeys = [];

      while (keysCopy.length > 0) {
        groupedKeys.push(keysCopy.splice(0, 20));
      }
      setKeysGroup(groupedKeys);
      setDisplayingKeysIndex(0);
      console.log(groupedKeys);
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
    <div>
      {keysGroup && keysGroup.length > 1 && (
        <ul className="pagination">
          <li className="page-item">
            <button className="page-link" onClick={goBackPage}>
              Previous
            </button>
          </li>
          <li className="page-item">
            <button className="page-link" onClick={goForwardPage}>
              Next
            </button>
          </li>
        </ul>
      )}

      <nav className="nav flex-column">
        {keysGroup &&
          keysGroup[displayingKeysIndex] &&
          keysGroup[displayingKeysIndex].map((key, index) => (
            <button
              key={`${key}${index}`}
              className={
                activeButtonName == key
                  ? "btn btn-danger nav-item mt-1"
                  : "btn btn-primary nav-item mt-1"
              }
              onClick={() => sideBarButtonOnClick(key)}
            >
              {key}
            </button>
          ))}
      </nav>
    </div>
  );
};

export default KeysSideBar;
