import { useState } from "react";
import GraphSideBar from "./PieChartSideBar";
import PieChart from "./PieChart";

type PieChartContainerProps = {
  allRowsList: Record<string, any>[];
};
const PieChartContainer: React.FC<PieChartContainerProps> = ({
  allRowsList,
}: PieChartContainerProps) => {
  const keysList = [
    "Eco-Evo Focus",
    "Life history",
    "Ecological Loci/Traits",
    "Additional Loci/Traits",
    "Mating system",
    "Ploidy",
    "Selection",
    "Spatial Structure",
    "Population Size",
    "Ecological Model",
    "Recurrent Mutation",
    "IBS",
  ];
  type KeysListType = (typeof keysList)[number];
  const [currentPieChart, setCurrentPieChart] =
    useState<KeysListType>("Eco-Evo Focus");

  const sideBarButtonOnClick = (name: string) => {
    setCurrentPieChart(name);
  };
  return (
    <div className="row">
      <div className="col-12 col-md-4 col-lg-2">
        <GraphSideBar
          keys={keysList}
          sideBarButtonOnClick={sideBarButtonOnClick}
          activeButtonName={currentPieChart}
        />
      </div>

      <div className="col-12 col-md-8 col-lg-10">
        <p className="h3">{currentPieChart}</p>
        <PieChart displayingName={currentPieChart} allRows={allRowsList} />
      </div>
    </div>
  );
};

export default PieChartContainer;
