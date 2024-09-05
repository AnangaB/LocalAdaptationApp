import Tree, { RawNodeDatum, RenderCustomNodeElementFn } from "react-d3-tree";
import { measureTextWidth } from "../../../logic/Graphs/Tree/RenderNodes";
import "./style/TreeStyle.css";

// Define interfaces for node and link data

interface TreeDisplayProps {
  data: RawNodeDatum;
  paperNameOnClick: (citationKey: string) => void;
}

const TreeDisplay: React.FC<TreeDisplayProps> = ({
  data,
  paperNameOnClick,
}) => {
  /**Function to render a node in the tree
   *
   * @param nodeDatum node data
   * @returns
   */

  const renderRectSvgNode: RenderCustomNodeElementFn = ({ nodeDatum }) => {
    const nameList: string[] = nodeDatum.name.split(", ");
    let oldFirstElement = "";
    if (nameList.length > 0 && nameList[0].includes("Differing:")) {
      oldFirstElement = nameList[0];
      nameList[0] = "❌ " + nameList[0].substring(10);
    }

    const nodeWidth = Math.max(...nameList.map((n) => measureTextWidth(n)));
    const textHeight = 15 * nameList.length;
    const maxHeight = 80;

    return (
      <g className="NodeContainer">
        <rect className="nodeRect" width={nodeWidth} height={maxHeight} x="0" />
        <foreignObject x="0" y="0" width={nodeWidth} height={maxHeight}>
          <div
            className="NodeTexts"
            style={{
              width: `${nodeWidth}px`,
              height: `${maxHeight}px`,
              overflowY: textHeight > maxHeight ? "scroll" : "hidden", // Enable scrolling if text exceeds max height
            }}
          >
            {nameList.map((n, index) => (
              <div
                key={index}
                className={
                  index == 0 && oldFirstElement.includes("Differing:")
                    ? "differingNodeHeaderText"
                    : "paperNameText"
                }
                onClick={() =>
                  !(index == 0 && oldFirstElement.includes("Differing:")) &&
                  paperNameOnClick(n)
                }
                style={{
                  cursor:
                    index == 0 && oldFirstElement.includes("Differing:")
                      ? "default"
                      : "pointer",
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </foreignObject>
      </g>
    );
  };
  const node_size = { x: 300, y: 90 };
  return (
    <div className="container-fluid h-100 border border-dark">
      <Tree
        data={data}
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        renderCustomNodeElement={renderRectSvgNode}
        nodeSize={node_size}
      />
    </div>
  );
};

export default TreeDisplay;
