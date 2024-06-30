import Tree, { RawNodeDatum, RenderCustomNodeElementFn } from "react-d3-tree";
// Define interfaces for node and link data

interface TreeDisplayProps {
  data: RawNodeDatum;
}

const TreeDisplay: React.FC<TreeDisplayProps> = ({ data }) => {
  const measureTextWidth = (n: string) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = "14px sans-serif";
      return context.measureText(n).width;
    }
    return 0;
  };

  const renderRectSvgNode: RenderCustomNodeElementFn = ({ nodeDatum }) => {
    const nameList: string[] = nodeDatum.name.split(", ");
    const textWidth = Math.max(...nameList.map((n) => measureTextWidth(n)), 20);
    const textHeight = 20 * nameList.length;
    return (
      <g>
        <rect
          width={textWidth + 10}
          height={textHeight + 5}
          fill="white"
          x="0"
        />
        {nameList.map((n, index) => (
          <text
            key={index}
            fontSize="14px"
            fontFamily="sans-serif"
            fill="black"
            x="5"
            strokeWidth="1"
            y={20 * (index + 1)}
          >
            {n}
          </text>
        ))}
      </g>
    );
  };
  return (
    <div className="container-fluid h-100">
      <Tree
        data={data}
        pathFunc={"elbow"}
        renderCustomNodeElement={renderRectSvgNode}
        nodeSize={{ x: 300, y: 200 }}
      />
    </div>
  );
};

export default TreeDisplay;
