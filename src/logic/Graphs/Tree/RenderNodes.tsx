/**Measures how much space a text will take up in the canvas, used for sizing for nodes in tree
 *
 * @param n a string
 * @returns width of text
 */
export const measureTextWidth = (n: string) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (context) {
    context.font = "20px sans-serif";
    return context.measureText(n).width;
  }
  return 0;
};
/**Function to render a node in the tree
 *
 * @param param0
 * @returns
 */
/*
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
            >
              {n}
            </text>
          );
        }
      })}
    </g>
  );
};
*/
