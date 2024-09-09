import ExcelJS from "exceljs";
import { categorivalVars, DataRow, Dataset, DataSetFilters, getEmptyDataFilter, getEmptyDataRow, isDataRowKey, RowSimilarityScores, weakKeysList } from "../../types/Datasets/DatasetTypes";

/**
 * reads a dataset of xlsx format and contains methods to return theat dataset or return a filtered verison of the dataset 
 */
export class DatasetSystem{
    private fileLocation: string;
    private dataset: Dataset;
    private datasetReady: Promise<void>;
    private isDataSetLoaded: boolean;
    private datasetFilters: DataSetFilters;

    /** Constructor to initialze this object by reading an xlsx file and storing it as DatasetType
     * 
     * @param fileLocation a excel file location
     */
    constructor(fileLocation: string = "") {
        
        this.fileLocation = fileLocation;
        this.dataset = [];
        this.isDataSetLoaded = false;
        this.datasetReady = this.fillDataset();
        this.datasetFilters = getEmptyDataFilter();
      
      
    }

    
    /**setter function for datasetFilters
     * 
     * @param filter contains regex used for filtering rows later
     */
    public setDataSetFilter(filter:DataSetFilters){
      this.datasetFilters = filter;
    }

    /**setter function for datasetFilters, but takes a row as param. Converts that row to regex values before setting datasetFilters
     * 
     * @param filter contains regex used for filtering rows later
     */
    public setDataSetFilterToMatchRow(row:DataRow){
      this.datasetFilters = this.covertRowItemsToRegex(row);
    }

    //fill dataset var with the rows from the excel file
    private async fillDataset() {
        if(this.fileLocation == ""){
          return;
        }
        let dataWorksheet:ExcelJS.Worksheet | null = null;
        try {
          // Fetch the Excel file
          const response = await fetch(this.fileLocation);
          //const response = await fetch("LocalAdaptationApp/public/data.xlsx");
  
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
  
          // Convert the response to a Blob
          const blob = await response.blob();
  
          // Create a FileReader to read the Blob
          const arrayBuffer = await blob.arrayBuffer();
  
          // Load the ArrayBuffer into ExcelJS Workbook
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(arrayBuffer);
          
          dataWorksheet = workbook.worksheets[0];

        } catch (error) {
          console.error("Error reading Excel file:", error);
        }

        if (dataWorksheet) {
            this.dataset = [];
            let header: string[] = [];
            let index: number = 0;
      
            dataWorksheet.eachRow((row, rowNumber) => {
              if (rowNumber == 1) {
                header = row.values as string[];
                header = header.map((h) => h.trim());
                //fix how there is no title for first column
                //header.shift();
                header[0] = "Index";
      
                //const newColDefs = header.map((field) => ({ field }));
                //setDataTableHeaders(newColDefs);
              } else {
                const newEntry:DataRow = getEmptyDataRow();
                newEntry["Index"] = String(index);
                index++;
                for (let i = 1; i < header.length; i++) {
                  const headerKey = header[i];
                  //if header does not match our specified headers list, then will not accept column values
                  if (isDataRowKey(headerKey)) {
                    // Safely extract cell value
                    const cellValue = row.getCell(i).value;

                    // Assign default empty string if cellValue is undefined or null
                    newEntry[headerKey] = (cellValue ?? "").toString();
                  }                
                }
                  this.dataset.push(newEntry);
              }
            });

          }

          //console.log(this.dataset)

      }

    // Method to get the dataset, ensuring it is filled before returning
    public async getDataset():Promise<Dataset> {
        await this.datasetReady;
        this.isDataSetLoaded = true;
        return this.dataset;
    }

    // Method to get the dataset, ensuring it is filled before returning
    public getDatasetAfterFiltering(): Dataset {
      let filteredDataset: Dataset = [];
    
      if (this.isDataSetLoaded) {
        filteredDataset = this.dataset.filter((row) => this.isRowValid(row));
      } else {
        console.log("Dataset has not loaded yet");
      }
      
      return filteredDataset;
    }

    //returns a boolean of whether a given row matches datasetFilters
    private isRowValid(row:DataRow){
      
      if (row) {
        let isMatch: boolean = true;

        for (const key of Object.keys(this.datasetFilters)) {
          
          const searchValue: RegExp =
          this.datasetFilters[key as keyof DataSetFilters] || /.*/i;

          if(!this.datasetFilters[key as keyof DataSetFilters] ){
            console.log("invalid regex: ", this.datasetFilters[key as keyof DataSetFilters] )
          }
          const rowValue = String(row[key as keyof DataRow]);
          
    
          const matches = searchValue.test((rowValue));


          if (!matches) {
            isMatch = false;
          }
        }
        return isMatch;
      }
      else{
        console.log("Row is not a valid row.")
      }
      return false


    }

    //returns a RowSimilarityScores type, which records the score of how similar each row of data set is to the datafilters
    public getDatasetSimilarityScore():RowSimilarityScores{
      const scores:RowSimilarityScores= new Map();
    
      if (this.isDataSetLoaded) {
        for (const row of this.dataset) {
          let similarScore = 0;  
          for (const key of Object.keys(row)) {
            const searchValue: RegExp =
              this.datasetFilters[key as keyof DataSetFilters] || /.*/i;
            
            if (!this.datasetFilters[key as keyof DataSetFilters]) {
              console.log("invalid regex: ", this.datasetFilters[key as keyof DataSetFilters]);
            }
    
            const rowValue: string = row[key as keyof DataRow];
 
            if (weakKeysList.includes(key as keyof DataRow) && searchValue.test(rowValue)) {
              similarScore += 1;
            }
          }
          scores.set(String(row["Index"]), similarScore);
        }
      } else {
        console.log("Data set has not loaded yet");
      }
      return scores;
    }
    /**converts a given row values to regex values
     * 
     * @param row a data row
     * @returns a regex that matches with values contained in the row
     */
    private covertRowItemsToRegex(row:DataRow) {
      const output: DataSetFilters = getEmptyDataFilter();
  
      if (row) {
          Object.keys(row).forEach((k) => {
              if (k in output) {
                  let value = String(row[k as keyof DataRow])
                  .replace(/\)\)/g, ")")
                  .replace(/\(/g, "\\(")
                  .replace(/\)/g, "\\)");
                
 
                  //want to match rows that contain categorical variables, with a regex that matches from the start of string
                  if(categorivalVars.includes(k as keyof DataRow)){
                    value = "^" + value
                  }
                  if (String(value) && String(value).length > 0) {
                      output[k as keyof DataSetFilters] = new RegExp(value, "i");
                      //console.log(new RegExp(value, "ig"), value,String(row[k  as keyof DataRow]))
                  }
              }
          
          })
      }
      
      return output;
  
    }

    /**Creates a list fo Datasets, each containing rows that match weakly with the param similaritiesScores. The first data set, contains all rows in dataset, that have a score of 1 less than the max score among all rows. Similarly, the second dataset in list, contains all rows with score of maxScore -2, and so on, until we reach whatever is the highest between maxScore-5 or the minimum score on similaritiesScores
     * 
     * @param similaritiesScores 
     * @returns a list of Datasets, each of different level of weak match
     */
    public getListOfWeakMatches(similaritiesScores:RowSimilarityScores){
      
      const values = Array.from(similaritiesScores.values()).map(Number);
      //console.log(similaritiesScores, values);

      if (similaritiesScores && values.length > 0) {
        const minScore = Math.min(...values);
        const maxScore = Math.max(...values);

        //if true means currenlty no search param is selected
        if (minScore != maxScore) {
          let weakMatchLevels = maxScore - minScore;
          weakMatchLevels = Math.min(weakMatchLevels, 5);

          const newWeakMatchesDisplayList: Dataset[] = [];

          for (let i = 1; i <= weakMatchLevels; i++) {
            const levelScore = maxScore - i;
            const matchesAtLevel: Dataset = [];
            for (const row of this.dataset) {
              if (similaritiesScores.get(row["Index"]) == levelScore) {
                matchesAtLevel.push(row);
              }
            }

            newWeakMatchesDisplayList.push(matchesAtLevel);
          }

          return newWeakMatchesDisplayList;
        }
      }
      return []

      
    }
    /**Returns a row that has the matching citationKey or otherwise returns null
     * 
     * @param citationKey 
     * @returns 
     */
    public getRowBasedOnCitationKey(citationKey:string){
      for(const d of this.dataset){
        if(d["Citation Key"] == citationKey){
          return d;
        }
      }
      return null;
    }

    
}