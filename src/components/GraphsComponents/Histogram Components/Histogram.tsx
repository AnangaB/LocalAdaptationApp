import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
} from "chart.js";
import { useEffect, useState } from "react";
ChartJS.register(BarElement, Tooltip, Legend, LinearScale, CategoryScale);
type HistogramProps = {
  allRows: Record<string, string>[];
};

const Histogram: React.FC<HistogramProps> = ({ allRows }) => {
  const [yearData, setYearData] = useState<Record<string, number>>({});

  useEffect(() => {
    const allRowsCopy = [...allRows];
    console.log(allRowsCopy);
    const newYearData = allRowsCopy.reduce((acc, row) => {
      const year = row["Year"];
      if (year) {
        acc[year] = (acc[year] || 0) + 1;
      }
      console.log;
      return acc;
    }, {} as Record<string, number>);
    setYearData(newYearData);
  }, [allRows]);

  return (
    <div>
      <h1>Histogram</h1>
      <Bar
        data={{
          labels: Object.keys(yearData),
          datasets: [
            {
              label: "Number of Records per Year",
              data: Object.values(yearData),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default Histogram;
