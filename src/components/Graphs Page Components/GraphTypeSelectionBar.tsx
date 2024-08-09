import { DisplayGraphType } from "../../types/Graphs/GraphTypes";

type GraphTypeSelectionBarProps = {
  buttonOnClick: (type: DisplayGraphType) => void;
  currentGraphType: DisplayGraphType;
};

const GraphTypeSelectionBar: React.FC<GraphTypeSelectionBarProps> = ({
  buttonOnClick,
  currentGraphType,
}) => {
  return (
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <button
          className={
            currentGraphType == DisplayGraphType.PieChart
              ? "nav-link active"
              : "nav-link"
          }
          aria-current="page"
          onClick={() => buttonOnClick(DisplayGraphType.PieChart)}
        >
          Pie Chart
        </button>
      </li>
      <li className="nav-item">
        <button
          className={
            currentGraphType == DisplayGraphType.Histogram
              ? "nav-link active"
              : "nav-link"
          }
          onClick={() => buttonOnClick(DisplayGraphType.Histogram)}
        >
          Histogram
        </button>
      </li>
      <li className="nav-item">
        <button
          className={
            currentGraphType == DisplayGraphType.Tree
              ? "nav-link active"
              : "nav-link"
          }
          onClick={() => buttonOnClick(DisplayGraphType.Tree)}
        >
          Tree
        </button>
      </li>
    </ul>
  );
};
export default GraphTypeSelectionBar;
