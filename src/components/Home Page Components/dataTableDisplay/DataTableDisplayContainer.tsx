import { useState, useEffect, useRef } from "react";
import DataTableDisplay from "./DataTableDisplay";
import IndividualPage from "../../Common Components/IndividualPage";
import WeakMatchesDisplay from "./WeakMatchesDisplay";
import { DatasetSystem } from "../../../logic/Dataset Management/DatasetSystem";
import {
  DataRow,
  Dataset,
  DataSetFilters,
  RowSimilarityScores,
} from "../../../types/Datasets/DatasetTypes";

interface DataTableDisplayContainerProps {
  SearchParams: DataSetFilters;
}
//describes whether or not to display an individual page,, and which individual page to display
interface IndividualPageDisplayMode {
  display: boolean;
  currentRow: Record<string, string>;
}

const DataTableDisplayContainer: React.FC<DataTableDisplayContainerProps> = ({
  SearchParams,
}) => {
  const [dataSetObject, setDataSetObject] = useState<DatasetSystem>(
    new DatasetSystem()
  );
  const [fullyMatchingRowsList, setFullyMatchingRowsList] = useState<Dataset>(
    []
  );

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

  const [rowSimilarityScores, setRowSimilarityScore] =
    useState<RowSimilarityScores>(new Map());

  //update fullyMatchingRowsList with the search param values
  useEffect(() => {
    if (dataSetObject) {
      dataSetObject.setDataSetFilter(SearchParams);
      const data: Dataset = dataSetObject.getDatasetAfterFiltering();
      setFullyMatchingRowsList(data);
      const scores: RowSimilarityScores =
        dataSetObject.getDatasetSimilarityScore();
      setRowSimilarityScore(scores);
    }
  }, [SearchParams]);

  //state to describe whether to display details about an individual paper and which paper (currentRow con)
  const [individualPageDisplayMode, setIndividualPageDisplayMode] =
    useState<IndividualPageDisplayMode>({
      display: false,
      currentRow: {},
    });

  const pageTitleOnclick = (row: DataRow) => {
    if (dataSetObject) {
      if (row) {
        setIndividualPageDisplayMode({
          display: true,
          currentRow: row,
        });
        //for similar papers display
        dataSetObject.setDataSetFilterToMatchRow(row);

        const scores: RowSimilarityScores =
          dataSetObject.getDatasetSimilarityScore();
        setIndividualPageSimilarityScores(scores);
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  };

  //the similarity scores of all the rows in the data set, to a specific row values
  //used for weak matches between rows
  const [individualPageSimilarityScores, setIndividualPageSimilarityScores] =
    useState<RowSimilarityScores>(new Map());
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="m-0 container-fluid bg-light"
      ref={containerRef}
      style={{ scrollMarginTop: "200px" }}
    >
      {individualPageDisplayMode["display"] == true ? (
        <>
          <IndividualPage
            row={individualPageDisplayMode["currentRow"]}
            backButtonOnClick={() => {
              setIndividualPageDisplayMode({
                display: false,
                currentRow: {},
              });
            }}
          />
          <WeakMatchesDisplay
            datasetSystem={dataSetObject}
            similaritiesScores={individualPageSimilarityScores}
            pageTitleOnclick={pageTitleOnclick}
          />
        </>
      ) : (
        <div className="pt-4">
          <p className="h3 text-center">
            Papers fully matching all search parameters:
          </p>

          <DataTableDisplay
            dataDisplayList={fullyMatchingRowsList}
            pageTitleOnclick={pageTitleOnclick}
          />
          <WeakMatchesDisplay
            datasetSystem={dataSetObject}
            similaritiesScores={rowSimilarityScores}
            pageTitleOnclick={pageTitleOnclick}
          />
        </div>
      )}
    </div>
  );
};

export default DataTableDisplayContainer;
