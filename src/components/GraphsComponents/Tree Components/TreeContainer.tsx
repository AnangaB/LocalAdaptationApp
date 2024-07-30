import { useEffect, useState } from "react";
import { makeTree } from "../../../logic/ConstructRelationTree";
import { filterAllRows } from "../../../logic/FilerDataSet";
import { covertRowItemsToRegex } from "../../../logic/ConvertRowItemsToRegex";
import { RawNodeDatum } from "react-d3-tree";
import TreeDisplay from "./TreeDisplay";
import KeysSideBar from "../../Common Components/KeysSideBar";
import IndividualPage from "../../Common Components/IndividualPage";

type TreeContainerProps = {
  allRowsList: Record<string, any>[];
};
const TreeContainer: React.FC<TreeContainerProps> = ({
  allRowsList,
}: TreeContainerProps) => {
  const [currentTree, setCurrentTree] = useState<string>("");
  const [row, setRow] = useState<Record<string, string> | null>(null);
  const [treeData, setTreeData] = useState<RawNodeDatum | null>(null);

  const sideBarButtonOnClick = (name: string) => {
    setCurrentTree(name);
    if (allRowsList) {
      const selectedRow = allRowsList.find((r) => r["Citation Key"] === name);
      if (selectedRow) {
        setRow(selectedRow);
      }
    }
  };
  //state that will contain how similar
  const [individualPageSimilarityScores, setIndividualPageSimilarityScores] =
    useState<Record<number, number>>({});

  useEffect(() => {
    if (allRowsList && allRowsList.length > 0) {
      filterAllRows(
        allRowsList,
        covertRowItemsToRegex(allRowsList[1]),
        setIndividualPageSimilarityScores,
        null
      );
      setRow(allRowsList[1]);
      setCurrentTree(allRowsList[1]["Citation Key"]);
    }
  }, []);

  useEffect(() => {
    if (allRowsList && row) {
      filterAllRows(
        allRowsList,
        covertRowItemsToRegex(row),
        setIndividualPageSimilarityScores,
        null
      );
    }
  }, [currentTree]);

  useEffect(() => {
    if (row) {
      const tree = makeTree(row, allRowsList, individualPageSimilarityScores);
      setTreeData(tree);
    }
  }, [individualPageSimilarityScores]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6  h-100 overflow-auto col-md-3 col-lg-2">
          <KeysSideBar
            keys={allRowsList.map((r) => r["Citation Key"])}
            sideBarButtonOnClick={sideBarButtonOnClick}
            activeButtonName={currentTree}
          />
        </div>
        <div className="col-6 col-md-9 col-lg-10 border">
          <div style={{ width: "100%", height: "70vh" }}>
            {treeData != null && <TreeDisplay data={treeData} />}
          </div>
          <div>{row && <IndividualPage row={row} />}</div>
        </div>
      </div>
    </div>
  );
};

export default TreeContainer;
