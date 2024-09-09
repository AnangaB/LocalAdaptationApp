import { useRef, useState } from "react";
import PieChart from "./PieChart";
import { Dataset, DataSetFilters } from "../../../types/Datasets/DatasetTypes";
import {
  PieChartkeysList,
  PieChartkeysType,
} from "../../../types/Graphs/PieChartTypes";
import AdvancedSearchBarDisplay from "../../Common Components/AdvancedSearchBarDisplay";
import PieChartSelectDropdown from "./PieChartSelectDropdown";

type PieChartContainerProps = {
  displayingDatasetRows: Dataset;
  handleFormChange: (index: keyof DataSetFilters, event: RegExp) => void;
};
const PieChartContainer: React.FC<PieChartContainerProps> = ({
  displayingDatasetRows,
  handleFormChange,
}: PieChartContainerProps) => {
  const pieChartRef = useRef<HTMLDivElement>(null);
  const [currentPieChart, setCurrentPieChart] =
    useState<PieChartkeysType>("Eco-Evo Focus");

  //calls the setter for currentPieChart, when one of the side button is clicked
  const optionOnClick = (name: string) => {
    setCurrentPieChart(name as PieChartkeysType);

    // Scroll to the PieChart component, if the chart is 200 px away from where the dropdowns are
    if (pieChartRef.current) {
      const topDistance = pieChartRef.current.getBoundingClientRect().top;
      const currentScroll =
        window.scrollY || document.documentElement.scrollTop;

      const distanceFromViewport = topDistance + currentScroll;

      if (distanceFromViewport > currentScroll + 200) {
        pieChartRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="row">
      <div className="col-12 col-md-4 col-lg-2 pt-1">
        <PieChartSelectDropdown
          options={PieChartkeysList}
          optionOnClick={optionOnClick}
          activeButtonName={currentPieChart}
        />
        <AdvancedSearchBarDisplay handleFormChange={handleFormChange} />
      </div>

      <div className="col-12 col-md-8 col-lg-10" ref={pieChartRef}>
        <p className="h3">{currentPieChart}</p>
        <PieChart
          displayingName={currentPieChart}
          dataset={displayingDatasetRows}
        />
      </div>
    </div>
  );
};

export default PieChartContainer;
