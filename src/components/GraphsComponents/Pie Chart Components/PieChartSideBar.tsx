import * as React from "react";

type PieChartSideBarProps = {
  keys: string[];
  sideBarButtonOnClick: (text: string) => void;
  activeButtonName: string;
};

const PieChartSideBar: React.FC<PieChartSideBarProps> = ({
  keys,
  sideBarButtonOnClick,
  activeButtonName,
}) => {
  return (
    <nav className="nav flex-column">
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

export default PieChartSideBar;
