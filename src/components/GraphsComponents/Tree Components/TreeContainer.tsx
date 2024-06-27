import { useEffect, useState } from "react";
import { makeTree } from "../../../logic/ConstructRelationTree";
import { filterAllRows } from "../../../logic/FilerDataSet";
import { covertRowItemsToRegex } from "../../../logic/ConvertRowItemsToRegex";
import Tree, { RawNodeDatum } from "react-d3-tree";
import RadialTree from "./RadialTree";

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
    <div style={{ width: "1500px", height: "1500px" }}>
      {treeData && <RadialTree data={treeData} />}
    </div>
  );
};

export default TreeContainer;
