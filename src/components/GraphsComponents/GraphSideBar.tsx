import * as React from "react";

type GraphSideBarProps = {
  keys: string[];
  sideBarButtonOnClick: (text: string) => void;
  activeButtonName: string;
};

const GraphSideBar: React.FC<GraphSideBarProps> = ({
  keys,
  sideBarButtonOnClick,
  activeButtonName,
}) => {
  return (
    <nav className="nav flex-column">
      <p className="h5">Select to generate the corresponding pie chart:</p>
      {keys.map((key) => (
        <button
          key={key}
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
  );
};

export default GraphSideBar;
