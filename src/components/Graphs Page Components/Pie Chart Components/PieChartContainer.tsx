import { useState } from "react";
import KeysSideBar from "../../Common Components/KeysSideBar";
import PieChart from "./PieChart";
import { Dataset } from "../../../types/Datasets/DatasetTypes";
import {
  PieChartkeysList,
  PieChartkeysType,
} from "../../../types/Graphs/PieChartTypes";

type PieChartContainerProps = {
  displayingDatasetRows: Dataset;
};
const PieChartContainer: React.FC<PieChartContainerProps> = ({
  displayingDatasetRows,
}: PieChartContainerProps) => {
  const [currentPieChart, setCurrentPieChart] =
    useState<PieChartkeysType>("Eco-Evo Focus");

  //calls the setter for currentPieChart, when one of the side button is clicked
  const sideBarButtonOnClick = (name: string) => {
    setCurrentPieChart(name as PieChartkeysType);
  };

  return (
    <div className="row">
      <div className="col-12 col-md-4 col-lg-2">
        <KeysSideBar
          keys={PieChartkeysList}
          sideBarButtonOnClick={sideBarButtonOnClick}
          activeButtonName={currentPieChart}
        />
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
