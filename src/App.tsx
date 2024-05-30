import SearchBar from "./components/search bar/SearchBar";
import DataTableDisplayContainer from "./components/dataTableDisplay/DataTableDisplayContainer";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { SearchParamProps } from "./types/SearchParamProps";

function App() {
  const [selectedSearchParams, setSelectedSearchParams] =
    useState<SearchParamProps>({
      "Paper Name": "",
      Authors: "",
      Year: "",
      Journal: "",
      Title: "",
      Abstract: "",
      "Open Access": "",
      "Reviewer 1": "",
      "Reviewer 2": "",
      Scope: "",
      "Eco-Evo Focus": "",
      Metric: "",
      "Life history": "",
      "Ecological Loci/Traits": "",
      "Additional Loci/Traits": "",
      "Mating system": "",
      Ploidy: "",
      Selection: "",
      "Spatial Structure": "",
      "Population Size": "",
      "Ecological Model": "",
      "Recurrent Mutation": "",
      IBS: "",
    });

  return (
    <div>
      <SearchBar
        selectedSearchParams={selectedSearchParams}
        setSelectedSearchParams={setSelectedSearchParams}
      />
      <DataTableDisplayContainer SearchParams={selectedSearchParams} />
    </div>
  );
}

export default App;
