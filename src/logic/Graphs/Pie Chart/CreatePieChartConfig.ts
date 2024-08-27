import {
  ChartConfiguration,
} from "chart.js";
import { DataHeaders } from "../../../types/Datasets/DatasetTypes";
import { getNColors } from "../Common/Colors";

/**Returns the config structure defining a pie chart
 * 
 * @param labels 
 * @param data 
 * @param displayingName 
 * @returns 
 */
export const getChartConfig = (labels:string[],data:number[],displayingName:DataHeaders) => {
        const backgroundColors = getNColors(data.length);

        const config: ChartConfiguration = {
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                label: displayingName,
                data: data,
                backgroundColor:backgroundColors
              },
            ],
          },
          options: {
            elements: {
              arc: {
                  borderWidth: 0
              }
          },
            plugins: {
              legend: {
                position: "top",
              }
            }
          },
        };

        return config
}