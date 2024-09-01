import { Dataset } from "../../../types/Datasets/DatasetTypes"
/**Given a dataset, aggregates it by the year the paper was published in, and creates a record with years as key and the frequencies of rows in that year as the values
 * 
 * @param dataset 
 * @returns a record containng key value pairs of year and frequency of papers with that year
 */
export const createHistogramDisplayData = (dataset:Dataset):  Record<number, number> => {
  if(dataset){
    const yearly_counts = dataset.reduce((acc, row) => {
      const year = Number(row["Year"]) || 0;
      if (year) {
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);
    const min_year = Math.min(...Object.keys(yearly_counts).map(Number));
    const max_year = Math.max(...Object.keys(yearly_counts).map(Number));

    const newYearData: Record<number, number> = {};
    for (let i = min_year; i <= max_year; i++) {
      if (i in yearly_counts) {
        newYearData[i] = yearly_counts[i];
      } else {
        newYearData[i] = 0;
      }
    }
    return(newYearData)
  }
  return {}
 
}