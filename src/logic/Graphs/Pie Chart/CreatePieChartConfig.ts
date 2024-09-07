import {
  ChartConfiguration,
} from "chart.js";
import { getNColors } from "../Common/Colors";

/**Returns the config structure defining a pie chart
 * 
 * @param labels 
 * @param data 
 * @param displayingName 
 * @returns 
 */
export const getChartConfig = (labels:string[],data:number[]) => {
        const backgroundColors = getNColors(data.length);

        const config: ChartConfiguration = {
          type: "pie",
          data: {
            labels: labels,
            datasets: [ 
              {
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
                onClick: ()=>{}
              },
              tooltip: {
                callbacks: {
                  label: (context) =>{
                    const data = context.dataset.data as number[];
                    console.log(data)
                    const total = data.reduce((a, b) => a + b, 0);
                       
                    const value = context.parsed as number;
                    const percentage = ((value / total) * 100).toFixed(2);

                    return `${value} out of ${total} (${percentage}%)`;

                  }
                }
              }
            },
            transitions: {
              resize: {
                animation: {
                  duration: 400 // there is a bug with chart js, where the pie chart will not animate at the start unless this duration is set to something other than 0
                }
              }
            }
          },
        };

        return config
}