import { useState, useEffect } from "react";
import { SearchParamProps } from "../../types/SearchParamProps";
import DataTableDisplay from "./DataTableDisplay";
import ExcelJS from "exceljs";

interface DataTableDisplayContainerProps {
  SearchParams: SearchParamProps;
}

const DataTableDisplayContainer: React.FC<DataTableDisplayContainerProps> = ({
  SearchParams,
}) => {
  // const [isIndividualPageDisplayMode, setIsIndividualPageDisplayMode] =
  //  useState<boolean>(false);

  //state to store worksheet containing the entire local adaptation data set
  const [originalDataTableWorksheet, setoriginalDataTableWorksheet] =
    useState<ExcelJS.Worksheet | null>(null);

  useEffect(() => {
    const loadWorkbook = async () => {
      try {
        // Fetch the Excel file
        const response = await fetch("/LocalAdaptationApp/data.xlsx");
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

        setoriginalDataTableWorksheet(workbook.worksheets[0]);
      } catch (error) {
        console.error("Error reading Excel file:", error);
      }
    };

    loadWorkbook();
  }, []);
  //stores the entire exported data table as a list, with each row being an record element in list
  const [originalDataTableDisplayJSON, setOriginalDataTableDisplayJSON] =
    useState<Record<string, any>[] | null>(null);

  // stores only the row element from originalDataTableDisplayJSON that is to be displayed
  const [dataTableDisplayJSON, setDataTableDisplayJSON] = useState<
    Record<string, string>[]
  >([]);
  //store headers for data table
  //const [dataTableHeaders, setDataTableHeaders] = useState<{ field: string }[]>(
  //[]
  //);

  useEffect(() => {
    if (originalDataTableWorksheet) {
      let rows: Record<string, any>[] = [];
      let header: string[] = [];
      let index: number = 0;
      originalDataTableWorksheet.eachRow((row, rowNumber) => {
        if (rowNumber == 1) {
          header = row.values as string[];
          //fix how there is no title for first column
          //header.shift();
          header[0] = "Index";

          //const newColDefs = header.map((field) => ({ field }));
          //setDataTableHeaders(newColDefs);
        } else {
          let newEntry: Record<string, any> = {};
          newEntry["Index"] = index;
          index++;
          for (let i = 1; i < header.length; i++) {
            newEntry[header[i]] = row.getCell(i).value;
          }
          rows.push(newEntry);
        }
      });
      setOriginalDataTableDisplayJSON(rows);
      setDataTableDisplayJSON(rows);
    }
  }, [originalDataTableWorksheet]);

  //update dataTableDisplayJSON with the search param values
  useEffect(() => {
    if (
      originalDataTableDisplayJSON != null &&
      originalDataTableDisplayJSON.length > 0
    ) {
      let rows: Record<string, any>[] = [];
      for (let i = 0; i < originalDataTableDisplayJSON.length; i++) {
        if (checkIfRowIsValid(originalDataTableDisplayJSON[i])) {
          rows.push(originalDataTableDisplayJSON[i]);
        }
      }
      setDataTableDisplayJSON(rows);
    }
  }, [SearchParams]);

  //check if a row, satisfies the input of SearchParams
  const checkIfRowIsValid = (row: Record<string, any>) => {
    return Object.keys(SearchParams).every((key) => {
      const searchValue = SearchParams[key as keyof SearchParamProps];
      const rowValue = row[key]?.toString().toLowerCase() || "";
      return searchValue.test(rowValue);
    });
  };

  return (
    <div className="m-0 container-fluid">
      <DataTableDisplay dataDisplayList={dataTableDisplayJSON} />
    </div>
  );
};
export default DataTableDisplayContainer;
