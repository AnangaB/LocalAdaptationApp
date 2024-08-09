import { useEffect, useState } from "react";
import GraphTypeSelectionBar from "./GraphTypeSelectionBar";
import PieChartContainer from "./Pie Chart Components/PieChartContainer";
import HistogramContainer from "./Histogram Components/HistogramContainer";
import TreeContainer from "./Tree Components/TreeContainer";
import { DatasetSystem } from "../../logic/Dataset Management/DatasetSystem";
import {
  Dataset,
  DataSetFilters,
  getEmptyDataFilter,
} from "../../types/Datasets/DatasetTypes";
import { DisplayGraphType } from "../../types/Graphs/GraphTypes";

const GraphsMainContent: React.FC<{}> = () => {
  const [dataSetObject, setDataSetObject] = useState<DatasetSystem>(
    new DatasetSystem()
  );

  const [fullyMatchingRowsList, setFullyMatchingRowsList] = useState<Dataset>(
    []
  );
  const [selectedSearchParams, setSelectedSearchParams] =
    useState<DataSetFilters>(getEmptyDataFilter());

  // Fetch and set the dataset
  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const datasetObj = new DatasetSystem("/LocalAdaptationApp/data.xlsx");
        setDataSetObject(datasetObj);

        const data = await datasetObj.getDataset(); // Ensure the dataset is loaded
        setFullyMatchingRowsList(data); // Initialize fullyMatchingRowsList with the same data
      } catch (error) {
        console.error("Error initializing dataset:", error);
      }
    };

    fetchDataset();
  }, []);

  useEffect(() => {
    dataSetObject.setDataSetFilter(selectedSearchParams);
    const data = dataSetObject.getDatasetAfterFiltering();
    setFullyMatchingRowsList(data);
  }, [selectedSearchParams]);

  //handles what happens when things in the advanced side bar is
  const handleFormChange = (index: keyof DataSetFilters, value: RegExp) => {
    let regex: RegExp = /.*/i;
    if (String(value) !== String("/(?:)/")) {
      regex = value;
    }
    const newData: DataSetFilters = {
      ...selectedSearchParams,
      [index]: regex,
    };
    setSelectedSearchParams(newData);
  };

  const [currentChartType, setCurrentChartType] = useState<DisplayGraphType>(
    DisplayGraphType.Histogram
  );

  return (
    <div className="container-fluid" style={{ paddingTop: "100px" }}>
      <GraphTypeSelectionBar
        buttonOnClick={(type: DisplayGraphType) => setCurrentChartType(type)}
        currentGraphType={currentChartType}
      />

      {currentChartType == DisplayGraphType.Histogram && (
        <HistogramContainer
          displayingDatasetRows={fullyMatchingRowsList}
          handleFormChange={handleFormChange}
        />
      )}

      {currentChartType == DisplayGraphType.PieChart && (
        <PieChartContainer displayingDatasetRows={fullyMatchingRowsList} />
      )}

      {currentChartType == DisplayGraphType.Tree && (
        <TreeContainer
          datasetSystem={dataSetObject}
          datasetRows={fullyMatchingRowsList}
        />
      )}
    </div>
  );
};

export default GraphsMainContent;
