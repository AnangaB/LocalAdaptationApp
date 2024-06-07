import SearchBar from "./components/search bar/SearchBarContainer";
import DataTableDisplayContainer from "./components/dataTableDisplay/DataTableDisplayContainer";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { SearchParamProps } from "./types/SearchParamProps";

function App() {

  //stores regex for each search bar menu
  const [selectedSearchParams, setSelectedSearchParams] =
    useState<SearchParamProps>({
      Index: /.*/,
      "Paper Name": /.*/,
      Authors: /.*/,
      Year: /.*/,
      Journal: /.*/,
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

  

  return (
    <div className="container-fluid m-0">
      <SearchBar
        selectedSearchParams={selectedSearchParams}
        setSelectedSearchParams={setSelectedSearchParams}
        advancedSearchButtonOnClick={advancedSearchButtonOnClick}
        isAdvancedSearchMode={isAdvancedSearchMode}
      />
      <DataTableDisplayContainer SearchParams={selectedSearchParams} />
    </div>
  );
}

export default App;
