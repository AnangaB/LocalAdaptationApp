//
//import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
//import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
//import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

import { DataRow, Dataset } from "../../../types/Datasets/DatasetTypes";

interface DataTableDisplayProps {
  dataDisplayList: Dataset;
  pageTitleOnclick: (row: DataRow) => void;
}

const DataTableDisplay: React.FC<DataTableDisplayProps> = ({
  dataDisplayList,
  pageTitleOnclick,
}) => {
  return (
    <div className="Container-fluid py-3 p-1 border-bottom border-dark overflow-scroll">
      <p className="h6">
        {dataDisplayList.length > 0 ? dataDisplayList.length : 0} entries found
      </p>
      <div className="row">
        <div className="h5 col-3">
          <p>Citation Key</p>
        </div>
        <div className="h5 col-6">
          <p>Paper Title</p>
        </div>
        <div className="h5 col-3">
          <p>Authors</p>
        </div>
      </div>
      {dataDisplayList &&
        dataDisplayList.map((row: DataRow) => (
          <div className="row" key={row["Title"] + " " + row["Index"]}>
            <div className="col-3">
              <p>{row["Citation Key"]}</p>
            </div>
            <div className="col-6">
              <p className="btn btn-link" onClick={() => pageTitleOnclick(row)}>
                {row["Title"]}
              </p>
            </div>
            <div className="col-3">
              <p>{row["Authors"]}</p>
            </div>
          </div>
        ))}
    </div>
  );
};
export default DataTableDisplay;
