import { useState } from "react";
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
  const [currentPieChart, setCurrentPieChart] =
    useState<PieChartkeysType>("Eco-Evo Focus");

  //calls the setter for currentPieChart, when one of the side button is clicked
  const optionOnClick = (name: string) => {
    setCurrentPieChart(name as PieChartkeysType);
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

      <div className="col-12 col-md-8 col-lg-10">
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
