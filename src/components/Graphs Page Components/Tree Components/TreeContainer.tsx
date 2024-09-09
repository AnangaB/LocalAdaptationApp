import { useEffect, useState } from "react";
import { makeTree } from "../../../logic/Graphs/Tree/ConstructRelationTree";
import { RawNodeDatum } from "react-d3-tree";
import TreeDisplay from "./TreeDisplay";
import KeysSideBar from "../../Common Components/KeysSideBar";
import IndividualPage from "../../Common Components/IndividualPage";
import {
  DataRow,
  Dataset,
  getEmptyDataRow,
} from "../../../types/Datasets/DatasetTypes";
import { DatasetSystem } from "../../../logic/Dataset Management/DatasetSystem";
import TreeControlsBar from "./TreeControlsBar";

type TreeContainerProps = {
  datasetSystem: DatasetSystem;
  datasetRows: Dataset;
};
const TreeContainer: React.FC<TreeContainerProps> = ({
  datasetSystem,
  datasetRows,
}: TreeContainerProps) => {
  //name of the current paper whose tree is being displayed
  const [currentTreeName, setCurrentTreeName] = useState<string>("");
  const [row, setRow] = useState<DataRow>(getEmptyDataRow());
  const [additionalPageRow, setAdditionalPageRow] = useState<DataRow>(
    getEmptyDataRow()
  );

  //contains data for drawing the tree
  const [treeData, setTreeData] = useState<RawNodeDatum | null>(null);

  //on click of items in the side bar
  const sideBarButtonOnClick = (name: string) => {
    setCurrentTreeName(name);
    if (datasetRows) {
      const selectedRow = datasetRows.find((r) => r["Citation Key"] === name);
      if (selectedRow) {
        setRow(selectedRow);
        setAdditionalPageRow(selectedRow);
      }
    }
  };

  //for intializing the first tree, when page loads
  useEffect(() => {
    if (datasetRows && datasetRows.length > 0) {
      datasetSystem.setDataSetFilterToMatchRow(datasetRows[0]);
      const similarityScoreList = datasetSystem.getDatasetSimilarityScore();
      const intialRow = datasetRows[0];

      const treeData = makeTree(intialRow, datasetRows, similarityScoreList);

      setTreeData(treeData);
      setRow(intialRow);
      setAdditionalPageRow(intialRow);
      setCurrentTreeName(datasetRows[0]["Citation Key"]);
    }
  }, [datasetRows, datasetSystem]);

  //generate data for new tree, when rows state changes
  useEffect(() => {
    if (datasetRows && row) {
      datasetSystem.setDataSetFilterToMatchRow(row);
      const similarityScoreList = datasetSystem.getDatasetSimilarityScore();

      const tree = makeTree(row, datasetRows, similarityScoreList);
      setTreeData(tree);
    }
  }, [datasetRows, datasetSystem, row]);

  const showOriginalPaperInfoOnClick = () => {
    setAdditionalPageRow(row);
  };
  const viewDisplayedPaperTreeOnClick = () => {
    setRow(additionalPageRow);
    setCurrentTreeName(additionalPageRow["Citation Key"]);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-sm-4 col-lg-2">
          {datasetRows && (
            <KeysSideBar
              keys={datasetRows.map((r) => r["Citation Key"])}
              sideBarButtonOnClick={sideBarButtonOnClick}
              activeButtonName={currentTreeName}
            />
          )}
        </div>
        <div className="col-12 col-sm-8 col-lg-10">
          <div style={{ width: "100%", height: "70vh" }}>
            {treeData != null && (
              <TreeDisplay
                data={treeData}
                paperNameOnClick={(s: string) =>
                  setAdditionalPageRow(
                    datasetSystem.getRowBasedOnCitationKey(s) || row
                  )
                }
              />
            )}
          </div>
          <div className="col-12">
            {row && (
              <>
                <TreeControlsBar
                  paperNameBeingShownInTree={row["Citation Key"]}
                  paperNameBeingShownInAdditionalInfo={
                    additionalPageRow["Citation Key"]
                  }
                  showOriginalPaperInfoOnClick={showOriginalPaperInfoOnClick}
                  viewDisplayedPaperTreeOnClick={viewDisplayedPaperTreeOnClick}
                />
                <IndividualPage row={additionalPageRow} showHeader={false} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeContainer;
