import SimpleSearchBar from "../components/Home Page Components/Search Bar/SimpleSearchBar";
import DataTableDisplayContainer from "../components/Home Page Components/Home Page Main Content Display/DataTableDisplayContainer";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  DataSetFilters,
  getEmptyDataFilter,
} from "../types/Datasets/DatasetTypes";
import MainMenuBar from "../components/Common Components/MainMenuBar";
import AdvancedSearchBarDisplay from "../components/Common Components/AdvancedSearchBarDisplay";
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
    let regex: RegExp = /.*/i;
    if (String(value) !== String("/(?:)/")) {
      regex = value;
    }
    const newData: DataSetFilters = {
      ...selectedSearchParams,
      [index]: regex,
    };
    setSelectedSearchParams(newData);
  };

  return (
    <div className="bg-light">
      <MainMenuBar isHomePageActive={true} />

      <div className="container-fluid  mt-1 p-0">
        <div className="row w-100 m-0">
          <div className="col-12 m-0 p-0">
            <SimpleSearchBar
              advancedSearchButtonOnClick={advancedSearchButtonOnClick}
              isAdvancedSearchMode={isAdvancedSearchMode}
              handleFormChange={handleFormChange}
            />
          </div>

          <div
            className={
              isAdvancedSearchMode
                ? "col-12 col-md-4 col-lg-3 m-0 p-0"
                : "d-none"
            }
          >
            <AdvancedSearchBarDisplay handleFormChange={handleFormChange} />
          </div>

          <div
            className={
              isAdvancedSearchMode
                ? "col-12 col-md-8 col-lg-9 m-0 p-0"
                : "col-12 m-0 p-0"
            }
          >
            <DataTableDisplayContainer SearchParams={selectedSearchParams} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Root;
