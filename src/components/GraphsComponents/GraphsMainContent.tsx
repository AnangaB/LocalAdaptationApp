import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import GraphTypeSelectionBar from "./GrpahTypeSelectionBar";
import PieChartContainer from "./Pie Chart Components/PieChartContainer";
import HistogramContainer from "./Histogram Components/HistogramContainer";

const GraphsMainContent: React.FC<{}> = () => {
  //const [allRows, setAllRows] = useState<Record<string, any>[]>([]);

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
    }
  }, [originalDataTableWorksheet]);

  enum PieChartDisplayType {
    PieChart,
    Histogram,
  }
  const [currentChartType, setCurrentChartType] = useState<PieChartDisplayType>(
    PieChartDisplayType.Histogram
  );

  return (
    <div className="container-fluid" style={{ paddingTop: "100px" }}>
      <p className="h5">Click the type of plot:</p>
      <GraphTypeSelectionBar
        buttonOnClick={(type: PieChartDisplayType) => setCurrentChartType(type)}
        currentGraphType={currentChartType}
      />
      {currentChartType == PieChartDisplayType.PieChart && (
        <PieChartContainer allRowsList={allRowsList} />
      )}
      {currentChartType == PieChartDisplayType.Histogram && (
        <HistogramContainer allRowsList={allRowsList} />
      )}
    </div>
  );
};

export default GraphsMainContent;
