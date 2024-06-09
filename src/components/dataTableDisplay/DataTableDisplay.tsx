//
//import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
//import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
//import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

interface DataTableDisplayProps {
  dataDisplayList: Record<string, string>[];
  pageTitleOnclick: (row: Record<string, string>) => void;
}

const DataTableDisplay: React.FC<DataTableDisplayProps> = ({
  dataDisplayList,
  pageTitleOnclick,
}) => {
  /* 
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
  }; */

  /**
  // some formatting for AgGridReact component below
  const defaultColDef = {
    flex: 1,
    minWidth: 110,
    resizable: true,
    autoHeight: true,
  };**/
  /** return (
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
  );**/

  return (
    <div className="Container-fluid py-3 border-bottom border-dark">
      <p className="h6">
        {dataDisplayList.length > 0 ? dataDisplayList.length : 0} entries found
      </p>
      <div className="row">
        <div className="h5 col-4">
          <p>Paper Name</p>
        </div>
        <div className="h5 col-4">
          <p>Paper Title</p>
        </div>
        <div className="h5 col-4">
          <p>Scope</p>
        </div>
      </div>
      {dataDisplayList &&
        dataDisplayList.map((row: Record<string, string>) => (
          <div className="row" key={row["Paper Name"] + " " + row["Index"]}>
            <div className="col-4">
              <p>{row["Paper Name"]}</p>
            </div>
            <div className="col-4">
              <p className="btn btn-link" onClick={() => pageTitleOnclick(row)}>
                {row["Title"]}
              </p>
            </div>
            <div className="col-4">
              <a href="">{row["Scope"]}</a>
            </div>
          </div>
        ))}
    </div>
  );
};
export default DataTableDisplay;
