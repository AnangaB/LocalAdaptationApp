import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartConfiguration,
} from "chart.js";
import { DataHeaders, Dataset } from "../../../types/Datasets/DatasetTypes";
import { getChartConfig } from "../../../logic/Graphs/Pie Chart/CreatePieChartConfig";
import useWindowSize from "../../../hooks/ResizeWindow";

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartDisplayProps = {
  dataset: Dataset;
  displayingName: DataHeaders;
};

const PieChart: React.FC<PieChartDisplayProps> = ({
  dataset,
  displayingName,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);
  const { width, height } = useWindowSize();

  //updates chart everytime, dataset and displaying name changes
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    //get unique values that column displayingName can take
    const labels = Array.from(
      new Set(dataset.map((row) => row[displayingName]))
    );

    //get counts of each of the unique values that column displayingName can take
    const data = labels.map(
      (label) => dataset.filter((row) => row[displayingName] === label).length
    );
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        const config: ChartConfiguration = getChartConfig(
          labels,
          data,
          displayingName
        );
        chartInstanceRef.current = new ChartJS(ctx, config);
      }
    }
  }, [dataset, displayingName, width, height]);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PieChart;
