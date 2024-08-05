import SimpleSearchBar from "../components/Home Page Components/search bar/SimpleSearchBar";
import DataTableDisplayContainer from "../components/Home Page Components/dataTableDisplay/DataTableDisplayContainer";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AdvancedSearchBar from "../components/Home Page Components/search bar/AdvancedSearchBar";
import {
  DataSetFilters,
  getEmptyDataFilter,
} from "../types/Datasets/DatasetTypes";
/**
 *
 * @returns Main Display container for the home page. Displays the top search bar, data table display items, and advacnced side bar that can be toggled on and off.
 */
function Root() {
  //stores regex for each search bar menu
  const [selectedSearchParams, setSelectedSearchParams] =
    useState<DataSetFilters>(getEmptyDataFilter());

  //state for when to show all advanced search menu
  const [isAdvancedSearchMode, setIsAdvancedSearchMode] =
    useState<boolean>(false);
  //toggles advanced search modes between true and false
  const advancedSearchButtonOnClick = (isAdvancedMode: boolean) => {
    if (isAdvancedMode) {
      setIsAdvancedSearchMode(false);
    } else {
      setIsAdvancedSearchMode(true);
    }
  };

  //function to call whenever, user makes changes to search menu
  const handleFormChange = (index: keyof DataSetFilters, value: RegExp) => {
    if (String(value) === String("/(?:)/")) {
      value = /.*/;
    }
    const newData = {
      ...selectedSearchParams,
      [index]: value,
    };
    console.log(newData);
    setSelectedSearchParams(newData);
  };

  return (
    <>
      <SimpleSearchBar
        advancedSearchButtonOnClick={advancedSearchButtonOnClick}
        isAdvancedSearchMode={isAdvancedSearchMode}
        handleFormChange={handleFormChange}
      />

      <div className="container-fluid bg-info">
        <div className="row" style={{ paddingTop: "100px" }}>
          <div
            className={
              isAdvancedSearchMode ? "col-12 col-md-4 col-lg-3" : "d-none"
            }
          >
            <AdvancedSearchBar handleFormChange={handleFormChange} />
          </div>

          <div
            className={
              isAdvancedSearchMode ? "col-12 col-md-8 col-lg-9" : "col-12"
            }
          >
            <DataTableDisplayContainer SearchParams={selectedSearchParams} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Root;
