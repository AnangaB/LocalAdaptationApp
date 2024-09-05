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