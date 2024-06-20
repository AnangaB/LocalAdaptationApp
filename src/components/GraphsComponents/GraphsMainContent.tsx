import { useEffect, useState } from "react";
import GraphSideBar from "./GraphSideBar";
import ExcelJS from "exceljs";
import PieChartDisplay from "./PieChartDisplay";

const GraphsMainContent: React.FC<{}> = () => {
  const keysList = [
    "Eco-Evo Focus",
    "Life history",
    "Ecological Loci/Traits",
    "Additional Loci/Traits",
    "Mating system",
    "Ploidy",
    "Selection",
    "Spatial Structure",
    "Population Size",
    "Ecological Model",
    "Recurrent Mutation",
    "IBS",
  ];
  type KeysListType = (typeof keysList)[number];

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

  const [currentPieChart, setCurrentPieChart] =
    useState<KeysListType>("Eco-Evo Focus");

  const sideBarButtonOnClick = (name: string) => {
    setCurrentPieChart(name);
  };
  return (
    <div className="container-fluid" style={{ paddingTop: "100px" }}>
      <div className="row">
        <div className="col-6 col-md-4 col-lg-2">
          <GraphSideBar
            keys={keysList}
            sideBarButtonOnClick={sideBarButtonOnClick}
            activeButtonName={currentPieChart}
          />
        </div>

        <div className="col-6 col-md-8 col-lg-10">
          <p className="h3">{currentPieChart}</p>
          <PieChartDisplay
            displayingName={currentPieChart}
            allRows={allRowsList}
          />
        </div>
      </div>
    </div>
  );
};

export default GraphsMainContent;
