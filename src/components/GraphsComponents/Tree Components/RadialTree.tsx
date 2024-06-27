import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// Define interfaces for node and link data
interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface RadialTreeProps {
  data: TreeNode;
}

const RadialTree: React.FC<RadialTreeProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const width = 928;
    const height = width;
    const cx = width * 0.5;
    const cy = height * 0.59;
    const radius = Math.min(width, height) / 2 - 30;

    const tree = d3
      .tree<TreeNode>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / (a.depth + 1));

    const root = tree(
      d3
        .hierarchy<TreeNode>(data)
        .sort((a, b) => d3.ascending(a.data.name, b.data.name))
    );

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-cx, -cy, width, height])
      .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

    svg.selectAll("*").remove(); // Clear old elements on update

    // Append links
    svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(root.links())
      .join("path")
      .attr("d", (d: any) => {
        return d3
          .linkRadial<TreeNode, d3.HierarchyPointLink<TreeNode>>()
          .angle((d: any) => d.x)
          .radius((d: any) => d.y)(d); // Call the linkRadial function with `d`
      });

    // Append nodes
    svg
      .append("g")
      .selectAll()
      .data(root.descendants())
      .join("circle")
      .attr(
        "transform",
        (d: any) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
      )
      .attr("fill", (d: any) => (d.children ? "#555" : "#999"))
      .attr("r", 2.5);

    // Append labels
    svg
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll()
      .data(root.descendants())
      .join("text")
      .attr(
        "transform",
        (d: any) =>
          `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0) rotate(${
            d.x >= Math.PI ? 180 : 0
          })`
      )
      .attr("dy", "0.31em")
      .attr("x", (d: any) => (d.x < Math.PI === !d.children ? 6 : -6))
      .attr("text-anchor", (d: any) =>
        d.x < Math.PI === !d.children ? "start" : "end"
      )
      .attr("paint-order", "stroke")
      .attr("stroke", "white")
      .attr("fill", "currentColor")
      .text((d: any) => d.data.name);
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default RadialTree;
