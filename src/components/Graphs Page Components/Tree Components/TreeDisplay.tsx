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
   * @param param0
   * @returns
   */

  const renderRectSvgNode: RenderCustomNodeElementFn = ({ nodeDatum }) => {
    const nameList: string[] = nodeDatum.name.split(", ");
    const textWidth = Math.max(...nameList.map((n) => measureTextWidth(n)), 20);
    const textHeight = 20 * nameList.length;

    return (
      <g>
        <rect
          className="nodeRect"
          width={textWidth + 10}
          height={textHeight + 10}
          x="0"
        />
        {nameList.map((n, index) => {
          if (n.includes("Differing:")) {
            const displayText = n.substring(10);
            return (
              <text
                className="differingNodeHeaderText"
                key={index}
                x="5"
                y={20 * (index + 1)}
              >
                {displayText}
              </text>
            );
          } else {
            return (
              <text
                key={index}
                className="paperNameText"
                x="5"
                y={20 * (index + 1)}
                onClick={() => paperNameOnClick(n)}
              >
                {n}
              </text>
            );
          }
        })}
      </g>
    );
  };
  return (
    <div className="container-fluid h-100 border border-dark">
      <Tree
        data={data}
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        renderCustomNodeElement={renderRectSvgNode}
        nodeSize={{ x: 300, y: 100 }}
      />
    </div>
  );
};

export default TreeDisplay;
