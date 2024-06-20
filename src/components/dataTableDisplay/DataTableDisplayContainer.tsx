import { useState, useEffect } from "react";
import { SearchParamProps } from "../../types/SearchParamProps";
import DataTableDisplay from "./DataTableDisplay";
import ExcelJS from "exceljs";
import IndividualPage from "./IndividualPage";
import WeakMatchesDisplay from "./WeakMatchesDisplay";
import { filterAllRows } from "../../logic/FilerDataSet";

interface DataTableDisplayContainerProps {
  SearchParams: SearchParamProps;
}
//describes whether or not to display an individual page,, and which individual page to display
interface IndividualPageDisplayMode {
  display: boolean;
  currentRow: Record<string, string>;
}

const DataTableDisplayContainer: React.FC<DataTableDisplayContainerProps> = ({
  SearchParams,
}) => {
  //state to store worksheet containing the entire local adaptation data set
  const [originalDataTableWorksheet, setoriginalDataTableWorksheet] =
    useState<ExcelJS.Worksheet | null>(null);

  //parse the data excel sheet
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
  const [allRowsList, setAllRowsList] = useState<Record<string, any>[]>([]);

  // stores only the row element from allRowsList that is to be displayed
  const [fullyMatchingRowsList, setFullyMatchingRowsList] = useState<
    Record<string, string>[]
  >([]);

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
      setAllRowsList(rows);
      setFullyMatchingRowsList(rows);
    }
  }, [originalDataTableWorksheet]);

  const [rowSimilarityScores, setRowSimilarityScore] = useState<
    Record<number, number>
  >({});

  //update fullyMatchingRowsList with the search param values
  useEffect(() => {
    filterAllRows(
      allRowsList,
      SearchParams,
      setRowSimilarityScore,
      setFullyMatchingRowsList
    );
  }, [SearchParams]);

  //state to describe whether to display details about an individual paper and which paper (currentRow con)
  const [individualPageDisplayMode, setIndividualPageDisplayMode] =
    useState<IndividualPageDisplayMode>({
      display: false,
      currentRow: {},
    });

  const pageTitleOnclick = (row: Record<string, string>) => {
    if (row) {
      setIndividualPageDisplayMode({
        display: true,
        currentRow: row,
      });
    }
  };

  return (
    <div className="m-0 container-fluid bg-light">
      {individualPageDisplayMode["display"] == true ? (
        <>
          <IndividualPage
            row={individualPageDisplayMode["currentRow"]}
            backButtonOnClick={() => {
              setIndividualPageDisplayMode({
                display: false,
                currentRow: {},
              });
            }}
          />
        </>
      ) : (
        <div className="pt-4">
          <p className="h3 text-center">
            Papers fully matching all search parameters:
          </p>

          <DataTableDisplay
            dataDisplayList={fullyMatchingRowsList}
            pageTitleOnclick={pageTitleOnclick}
          />
          <WeakMatchesDisplay
            allRowsList={allRowsList}
            similaritiesScores={rowSimilarityScores}
            pageTitleOnclick={pageTitleOnclick}
          />
        </div>
      )}
    </div>
  );
};

export default DataTableDisplayContainer;

/*
  //state to store worksheet containing the entire local adaptation data set
  const [originalDataTableWorksheet, setoriginalDataTableWorksheet] =
    useState<ExcelJS.Worksheet | null>(null);

  //parse the data excel sheet
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
  }, []);*/

/*
  //stores the entire exported data table as a list, with each row being an record element in list
  const allRowsList = parseData();

  // storesrow element from allRowsList that is to be displayed
  const [fullyMatchingRowsList, setFullyMatchingRowsList] = useState<
    Record<string, string>[]
  >([]);
  useEffect(() => {
    setFullyMatchingRowsList(allRowsList);
  }, [allRowsList]);*/

//store headers for data table
//const [dataTableHeaders, setDataTableHeaders] = useState<{ field: string }[]>(
//[]
//);
/*
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
      setAllRowsList(rows);
      setFullyMatchingRowsList(rows);
    }
  }, [originalDataTableWorksheet]);*/
