import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  ChartConfiguration,
  BarController,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { createHistogramDisplayData } from "../../../logic/Graphs/Histogram/CreateHistogramDisplayData";
import { Dataset } from "../../../types/Datasets/DatasetTypes";
import { getHistrogramConfigData } from "../../../logic/Graphs/Histogram/CreataHistogramConfig";

ChartJS.register(
  BarElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  BarController
);
type HistogramProps = {
  dataset: Dataset;
};

const Histogram: React.FC<HistogramProps> = ({ dataset }) => {
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const barChartInstanceRef = useRef<ChartJS | null>(null);

  const [yearData, setYearData] = useState<Record<number, number>>({});

  //construct year data
  useEffect(() => {
    if (dataset) {
      const newYearData = createHistogramDisplayData([...dataset]);
      setYearData(newYearData);
    }
  }, [dataset]);

  //updates chart everytime yearData changes
  useEffect(() => {
    if (barChartInstanceRef.current) {
      barChartInstanceRef.current.destroy();
    }

    const ctx = barChartRef.current?.getContext("2d");

    if (ctx) {
      const config: ChartConfiguration = getHistrogramConfigData(yearData);
      barChartInstanceRef.current = new ChartJS(ctx, config);
    }
  }, [yearData]);

  return (
    <div>
      <h1>Histogram</h1>
      <canvas ref={barChartRef}></canvas>
    </div>
  );
};

export default Histogram;
