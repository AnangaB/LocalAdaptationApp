import { SearchParamProps } from "../../types/SearchParamProps";
import ExcelJS from "exceljs";
import { useEffect, useState } from "react";

//
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

interface DataTableDisplayProps {
  SearchParams: SearchParamProps;
}

const DataTableDisplay: React.FC<DataTableDisplayProps> = ({
  SearchParams,
}) => {
  //state to store worksheet containing the entire local adaptation data set
  const [originalDataTableWorksheet, setoriginalDataTableWorksheet] =
    useState<ExcelJS.Worksheet | null>(null);

  useEffect(() => {
    const loadWorkbook = async () => {
      try {
        // Fetch the Excel file
        const response = await fetch("/public/data.xlsx");
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

  const [originalDataTableDisplayJSON, setOriginalDataTableDisplayJSON] =
    useState<Record<string, any>[] | null>(null);
  const [dataTableDisplayJSON, setDataTableDisplayJSON] = useState<
    Record<string, any>[] | null
  >(null);
  const [dataTableHeaders, setDataTableHeaders] = useState<
    { field: string }[] | null
  >(null);

  useEffect(() => {
    if (originalDataTableWorksheet) {
      let rows: Record<string, any>[] = [];
      let header: string[] = [];
      originalDataTableWorksheet.eachRow((row, rowNumber) => {
        if (rowNumber == 1) {
          header = row.values as string[];
          //fix how there is no title for first column
          header.shift();
          const newColDefs = header.map((field) => ({ field }));
          setDataTableHeaders(newColDefs);
        } else {
          let newEntry: Record<string, any> = {};
          for (let i = 0; i < header.length; i++) {
            newEntry[header[i]] = row.getCell(i + 1).value;
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
      const searchValue =
        SearchParams[key as keyof SearchParamProps]?.toLowerCase() || "";
      const rowValue = row[key]?.toString().toLowerCase() || "";
      return rowValue.includes(searchValue);
    });
  };

  // some formatting for AgGridReact component below
  const defaultColDef = {
    flex: 1,
    minWidth: 110,
    resizable: true,
    autoHeight: true,
  };
  return (
    <div>
      <h2>{dataTableDisplayJSON?.length} entries found</h2>
      {dataTableDisplayJSON && dataTableHeaders && (
        <div
          className="ag-theme-quartz"
          style={{ height: "400px", width: "100%" }}
        >
          <AgGridReact
            rowData={dataTableDisplayJSON}
            columnDefs={dataTableHeaders}
            defaultColDef={defaultColDef}
          />
        </div>
      )}
    </div>
  );
};
export default DataTableDisplay;
