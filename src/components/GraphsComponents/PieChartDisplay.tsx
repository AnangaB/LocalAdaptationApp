import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartDisplayProps = {
  allRows: Record<string, any>[];
  displayingName: string;
};

const PieChartDisplay: React.FC<PieChartDisplayProps> = ({
  allRows,
  displayingName,
}) => {
  // Extract unique labels from the allRows data based on displayingName
  const labels = Array.from(new Set(allRows.map((row) => row[displayingName])));

  // Aggregate data for each label
  const data = labels.map(
    (label) => allRows.filter((row) => row[displayingName] === label).length
  );

  const backgroundColors = [
    "#e6194b",
    "#3cb44b",
    "#ffe119",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#46f0f0",
    "#f032e6",
    "#bcf60c",
    "#fabebe",
    "#008080",
    "#e6beff",
    "#9a6324",
    "#fffac8",
    "#800000",
    "#aaffc3",
    "#808000",
    "#ffd8b1",
    "#000075",
    "#808080",
    "#ffffff",
    "#000000",
  ];

  return (
    <div>
      <Pie
        data={{
          labels: labels,
          datasets: [
            {
              label: displayingName,
              data: data,
              backgroundColor: backgroundColors,
            },
          ],
        }}
        style={{ width: "100%", maxHeight: "70vh" }}
        options={{
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default PieChartDisplay;
