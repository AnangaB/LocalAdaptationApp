enum PieChartDisplayType {
  PieChart,
  Histogram,
}

type GraphTypeSelectionBarProps = {
  buttonOnClick: (type: PieChartDisplayType) => void;
  currentGraphType: PieChartDisplayType;
};

const GraphTypeSelectionBar: React.FC<GraphTypeSelectionBarProps> = ({
  buttonOnClick,
  currentGraphType,
}) => {
  return (
    <ul className="nav nav-pills nav-justified">
      <li className="nav-item">
        <button
          className={
            currentGraphType == PieChartDisplayType.PieChart
              ? "nav-link active"
              : "nav-link"
          }
          aria-current="page"
          onClick={() => buttonOnClick(PieChartDisplayType.PieChart)}
        >
          Pie Chart
        </button>
      </li>
      <li className="nav-item">
        <button
          className={
            currentGraphType == PieChartDisplayType.Histogram
              ? "nav-link active"
              : "nav-link"
          }
          onClick={() => buttonOnClick(PieChartDisplayType.Histogram)}
        >
          Histogram
        </button>
      </li>
    </ul>
  );
};
export default GraphTypeSelectionBar;
