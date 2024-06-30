import { useEffect, useState } from "react";
import { makeTree } from "../../../logic/ConstructRelationTree";
import { filterAllRows } from "../../../logic/FilerDataSet";
import { covertRowItemsToRegex } from "../../../logic/ConvertRowItemsToRegex";
import { RawNodeDatum } from "react-d3-tree";
import TreeDisplay from "./TreeDisplay";

type TreeContainerProps = {
  allRowsList: Record<string, any>[];
};
const TreeContainer: React.FC<TreeContainerProps> = ({
  allRowsList,
}: TreeContainerProps) => {
  const row = allRowsList[0];

  //state that will contain how similar
  const [individualPageSimilarityScores, setIndividualPageSimilarityScores] =
    useState<Record<number, number>>({});

  useEffect(() => {
    console.log("herer");
    filterAllRows(
      allRowsList,
      covertRowItemsToRegex(row),
      setIndividualPageSimilarityScores,
      null
    );
  }, []);
  const [treeData, setTreeData] = useState<RawNodeDatum | null>(null);

  useEffect(() => {
    const tree = makeTree(row, allRowsList, individualPageSimilarityScores);
    setTreeData(tree);
  }, [individualPageSimilarityScores]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {treeData != null && <TreeDisplay data={treeData} />}
    </div>
  );
};

export default TreeContainer;
