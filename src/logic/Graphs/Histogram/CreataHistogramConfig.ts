import { ChartConfiguration } from "chart.js";
/**Returns the config data to generate the histogram
 * 
 * @param yearData record containg key value pairs of year and frequency of papers with that year
 * @returns config data to generate the histogram
 */
export const getHistrogramConfigData = (yearData:Record<number,number>) => {
    const configData:ChartConfiguration = { 
        type: 'bar',
        data:  {
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
          },
        options: {
            plugins:{
                legend: {
                    onClick: ()=>{}
                }
            },
            scales: {
                y: {
                beginAtZero: true
                }
            }
        }}
  return configData

}