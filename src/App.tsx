import SimpleSearchBar from "./components/search bar/SimpleSearchBar";
import DataTableDisplayContainer from "./components/dataTableDisplay/DataTableDisplayContainer";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { SearchParamProps } from "./types/SearchParamProps";
import AdvancedSearchBar from "./components/search bar/AdvancedSearchBar";
function App() {
  //stores regex for each search bar menu
  const [selectedSearchParams, setSelectedSearchParams] =
    useState<SearchParamProps>({
      Index: /.*/,
      "Citation Key": /.*/,
      Authors: /.*/,
      Year: /.*/,
      Journal: /.*/,
      "Journal ISO Abbreviation": /.*/,
      Title: /.*/,
      Abstract: /.*/,
      "Open Access": /.*/,
      "Reviewer 1": /.*/,
      "Reviewer 2": /.*/,
      Scope: /.*/,
      "Eco-Evo Focus": /.*/,
      Metric: /.*/,
      "Life history": /.*/,
      "Ecological Loci/Traits": /.*/,
      "Additional Loci/Traits": /.*/,
      "Mating system": /.*/,
      Ploidy: /.*/,
      Selection: /.*/,
      "Spatial Structure": /.*/,
      "Population Size": /.*/,
      "Ecological Model": /.*/,
      "Recurrent Mutation": /.*/,
      IBS: /.*/,
    });

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
  const handleFormChange = (index: keyof SearchParamProps, value: RegExp) => {
    if (String(value) === String("/(?:)/")) {
      value = /.*/;
    }
    const newData = {
      ...selectedSearchParams,
      [index]: value,
    };
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

export default App;
